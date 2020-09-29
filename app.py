import datetime
import flask
import json
import pandas as pd
import zipfile
import threading
import utils
from firebase_admin import credentials, initialize_app, \
    storage, firestore, auth, exceptions
from flask import render_template, request, redirect, \
    flash, send_file, make_response, jsonify, abort, \
    send_from_directory
import __data__ as data

app = flask.Flask(data.__app_name__)
app.config.update(
    prog=f'{data.__name__} v{data.__version__}',
    author=data.__author__
)

cred = credentials.Certificate("popup-firebase.json")
initialize_app(cred, {'storageBucket': 'popup-965c9.appspot.com'})

bucket = storage.bucket()
db = firestore.client()


@app.route('/favicon.ico')
def icon():
    return send_from_directory(app.static_folder, 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/experiment/<path:path>')
def src(path=''):
    return path


@app.route('/upload/experiment/<path:path>')
def src_from_upload(path=''):
    return redirect("experiment/" + path)


@app.route('/experiment/gs://<path:path>')
def src_gs(path=''):
    return "gs://" + path


@app.route('/', methods=["GET", "POST"])
def menu():
    return render_template("menu.html", title="Menu")


@app.route('/dashboard/<uid>')
def dashboard(uid):
    lst = []
    collection = db.collection(u'Experiments')
    for document in collection.stream():
        doc_dict = document.to_dict()
        if "uid" in doc_dict and doc_dict["uid"] == uid:
            new_doc = [doc_dict["name"], str(document.id), doc_dict["count"]]
            lst.append(new_doc)
    return render_template("dashboard.html",
                           lst=lst,
                           title="Dashboard")


@app.route('/delete_experiment', methods=["POST"])
def delete():
    experiment_id = request.json.get("value")
    experiment_name = db.collection(u'Experiments').document(experiment_id).get().to_dict()["name"]
    utils.delete_stimulus_folder(bucket, experiment_name)
    db.collection(u'Experiments').document(experiment_id).delete()


@app.route("/upload/<uid>", methods=["GET", "POST"])
def upload(uid):
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file_input' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file_input']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file:
            result, error_msg = utils.handle_input(db, file, uid)
            if result:
                return render_template("upload.html",
                                       title="Upload",
                                       value="Experiment Created",
                                       visible="visible",
                                       h2color="green",
                                       link="/experiment/" + str(result),
                                       linkExist="visibility")
            elif error_msg:
                return render_template("upload.html",
                                       title="Upload",
                                       visible="visible",
                                       h2color="red",
                                       linkExist="collapse",
                                       value=error_msg)

        return render_template("upload.html",
                               title="Upload",
                               visible="visible",
                               value="There is an error",
                               linkExist="collapse")
    else:
        return render_template("upload.html",
                               value="-",
                               visible="hidden",
                               linkExist="collapse",
                               title="Upload")


@app.route('/experiment/<experiment_id>', methods=["GET", "POST"])
def get_experiment(experiment_id):
    if request.method == "POST":
        if request.data:
            try:
                loads_value = json.loads(request.data.decode('utf8'))
                to_upload = {
                    "result": loads_value
                }
                utils.upload_data(db, to_upload, experiment_id)
                doc_ref = db.collection(u'Experiments').document(experiment_id)
                experiment = doc_ref.get().to_dict()
                update = {
                    'count': experiment['count'] + 1
                }
                doc_ref.update(update)
            except Exception as e:
                print(e)
    else:
        doc_ref = db.collection(u'Experiments').document(experiment_id)
        experiment = doc_ref.get().to_dict()
        try_count = 0
        while try_count < 5:
            try:
                if experiment:
                    timeline = utils.organize_by_blocks(experiment['timeline'],
                                                        experiment['count'],
                                                        bucket,
                                                        experiment['name'])
                    return render_template('experiment_html.html',
                                           title='Experiment',
                                           timeline=timeline,
                                           background_color=experiment['background_color'])
            except Exception as e:
                print(e)
                continue
            finally:
                try_count += 1
        return render_template('experiment_does_not_exist.html',
                               title='Psychology Experiment')


@app.route('/export', methods=["GET", "POST"])
def export_experiment_result():
    if request.method == "POST":
        user_id = request.values.get("id_input")
        final_df = pd.DataFrame()
        try:
            final_df = utils.collection_to_csv(db.collection(user_id))
            if request.form.get('removeAllData'):
                utils.delete_collection(db.collection(user_id),
                                        utils.get_collection_count(db.collection(user_id).stream()))
        except Exception as e:
            print("export bug: " + str(e))
            flash("There is a problem with export")
        finally:
            csv_file_name = "Experiment_Result.csv"
            final_df.to_csv(csv_file_name, mode='w')
            return send_file(csv_file_name,
                             mimetype='text/csv',
                             attachment_filename=csv_file_name,
                             as_attachment=True)
    else:
        return render_template("export.html", title="Export")


@app.route('/upload_images', methods=["GET", "POST"])
def upload_images_to_experiment():
    if request.method == "POST":
        # check if the post request has the file part
        if 'imagesInput' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['imagesInput']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file:
            name = request.values.get("name_input")
            if name is not None:
                extract_folder = "zip_folder/"
                zipfile.ZipFile(file).extractall(extract_folder)
                x = threading.Thread(target=utils.extract_and_upload_stimulus,
                                     args=(bucket, extract_folder, name,))
                x.start()

    return render_template("uploadImages.html", title="Add Stimulus")


@app.route('/details/<experiment_id>')
def get_experiment_detail(experiment_id):
    doc_ref = db.collection(u'Experiments').document(experiment_id)
    experiment = doc_ref.get().to_dict()
    return render_template("experiment_details.html", title="Details", lst=experiment['timeline'])


@app.route('/sessionLogin', methods=['POST'])
def session_login():
    """
    Session login
    :return:
    """
    print("Session Login")
    # Get the ID token sent by the client
    # id_token = request.headers.get('csfToken')
    id_token = request.values.get('idToken')
    # Set session expiration to 5 days.
    expires_in = datetime.timedelta(days=5)
    try:
        # Create the session cookie. This will also verify the ID token in the process.
        # The session cookie will have the same claims as the ID token.
        session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in)
        response = jsonify({'status': 'success'})
        # Set cookie policy for session cookie.
        expires = datetime.datetime.now() + expires_in
        response.set_cookie('session', session_cookie, expires=expires, httponly=True, secure=True)
        return response
    except exceptions.FirebaseError:
        return abort(401, 'Failed to create a session cookie')


@app.route('/profile', methods=['POST'])
def access_restricted_content():
    session_cookie = request.cookies.get('session')
    if not session_cookie:
        # Session cookie is unavailable. Force user to login.
        return redirect('/login')

    # Verify the session cookie. In this case an additional check is added to detect
    # if the user's Firebase session was revoked, user deleted/disabled, etc.
    try:
        decoded_claims = auth.verify_session_cookie(session_cookie, check_revoked=True)
        # Check custom claims to confirm user is an admin.
        if decoded_claims.get('admin') is True:
            return utils.serve_content_for_admin(decoded_claims)
        else:
            return abort(401, 'Insufficient permissions')
    except auth.InvalidSessionCookieError:
        # Session cookie is invalid, expired or revoked. Force user to login.
        return redirect('/login')


@app.route('/sessionLogout', methods=['POST'])
def session_logout():
    response = make_response(redirect('/login'))
    response.set_cookie('session', expires=0)
    return response


@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html', login_failed=False, login=True, title="Login")


if __name__ == '__main__':
    app.run(debug=True)
