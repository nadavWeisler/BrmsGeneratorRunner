//Create Fixation Canvas
function CreateFixation(_id, _className, _width, _height, _zIndex, _position,
                        _border, _visibility) {
    let fixation = document.createElement('canvas');
    fixation.id = _id;
    fixation.className = _className;
    fixation.width = _width;
    fixation.height = _height;
    fixation.style.zIndex = _zIndex;
    fixation.style.position = _position;
    // fixation.style.border = _border;
    fixation.style.visibility = _visibility;
    return fixation
}

//Create New Canvas
function CreateNewCanvas(_id, _className, _width, _height, _zIndex, _position,
                         _border, _visibility, _opacity) {
    let newCanvas = document.createElement('canvas');
    newCanvas.id = _id;
    newCanvas.className = _className;
    newCanvas.width = _width;
    newCanvas.height = _height;
    newCanvas.style.zIndex = _zIndex;
    newCanvas.style.position = _position;
    newCanvas.style.border = _border;
    newCanvas.style.visibility = _visibility;
    newCanvas.style.opacity = _opacity;
    return newCanvas
}

//Draw Fixation On Fixation Canvas
function CreateFixationContext(_id, _fillStyle, _frameWidth, _fixationWidth,
                               _frameHeight, _fixationHeight, _fixation) {

    let fixCtx = _fixation.getContext(_id);
    fixCtx.fillStyle = _fillStyle;
    fixCtx.fillRect(
        (_frameWidth - _fixationWidth) / 2,
        (_frameHeight - _fixationHeight) / 2,
        _fixationWidth, _fixationHeight);
    fixCtx.fillRect(
        (_frameWidth - _fixationHeight) / 2,
        (_frameHeight - _fixationWidth) / 2,
        _fixationHeight, _fixationWidth);
}

//Get all rectangle ranges
function GetRectanglesRange(_rectangle_Width, _rectangle_height, _frameWidth, _frameHeight) {
    return [-_rectangle_Width, -_rectangle_height,
        _frameWidth + _rectangle_Width,
        _frameHeight + _rectangle_height];
}

///Create Mondrian Canvas
function CreateMondrian(_id, _className, _width, _height, _zIndex, _position,
                        _border, _opacity) {

    let mondrian = document.createElement('canvas');
    mondrian.id = _id;
    mondrian.className = _className;
    mondrian.width = _width;
    mondrian.height = _height;
    mondrian.style.zIndex = _zIndex;
    mondrian.style.position = _position;
    mondrian.style.border = _border;
    mondrian.style.opacity = _opacity;
    return mondrian;
}

//Draw Mondrian
function CreateMondrianContext(_id, _mondrian, _fillStyle, _x, _y, _frameWidth,
                               _frameHeight) {
    let ctx = _mondrian.getContext(_id);
    ctx.fillStyle = _fillStyle;
    ctx.fillRect(_x, _y, _frameWidth, _frameHeight);
    return ctx;
}

//Fill Mondrian
function FillRectangles(_rectNum, _mondrianContext, _colors, _rectangle_Width,
                        _rectangle_Height,
                        _frameWidth, _frameHeight) {
    const rectRange = GetRectanglesRange(_rectangle_Width, _rectangle_Height, _frameWidth,
        _frameHeight);
    for (let j = 0; j < _rectNum; j++) {
        _mondrianContext.fillStyle = _colors[Math.floor(Math.random() * _colors.length)];
        _mondrianContext.fillRect(Math.round(Math.random() *
            (rectRange[2] - rectRange[0]) + rectRange[0]),
            Math.round(Math.random() * (rectRange[3] - rectRange[1]) + rectRange[1]),
            _rectangle_Width + Math.round(Math.random()) * _rectangle_Width,
            _rectangle_Height + Math.round(Math.random()) * _rectangle_Height);
    }
}

//Create Stimulus Canvas
function CreateStimulus(_id, _className, _width, _height, _zIndex, _position,
                        _border, _opacity) {
    let stimulus = document.createElement('canvas');
    stimulus.id = _id;
    stimulus.className = _className;
    stimulus.width = _width;
    stimulus.height = _height;
    stimulus.style.zIndex = _zIndex;
    stimulus.style.position = _position;
    // stimulus.style.border = _border;
    stimulus.style.opacity = _opacity;
    return stimulus;
}

function GetMondrianProfiles(max_flips) {
    return [
        [0, 1, stringSafe(4 / max_flips),
            1, stringSafe(4 / max_flips + 0.00001), 0]
    ];
}

function CreateMondrianProfiles(max_flips, fade_out_flip, regularFlip, mondrian_max_opacity, Hz,
                                fade_out_time, mondrian_count, stimulus_duration, mask_duration) {
    let x, x2;
    // Auxiliary variables
    let mondrian_profiles = GetMondrianProfiles(max_flips);

    x = stringSafe(6 / regularFlip);
    x2 = stringSafe(10 / regularFlip);

    for (let i = 6; i < regularFlip; i += 6) {
        x = stringSafe(i / max_flips);
        x2 = stringSafe((i + 4) / max_flips);

        let thisAlpha = 1;

        // Add zero if needed
        if (mondrian_profiles.length - 1 < (i / 6) % mondrian_count) {
            mondrian_profiles.push([0, 0])
        }

        // Push locations and values
        mondrian_profiles[(i / 6) % mondrian_count].push(stringSafe(x - 0.00001), 0, x,
            thisAlpha, x2, thisAlpha, stringSafe(x2 + 0.00001), 0);
    }

    for (let i = 6; i < fade_out_flip; i += 6) {
        // Compute locations
        x = stringSafe(i / fade_out_flip);
        x2 = stringSafe((i + 4) / fade_out_flip);


        let thisAlpha = Math.min(mondrian_max_opacity, (fade_out_flip - i - 1) / fade_out_flip);
        // Add zero if needed
        if (mondrian_profiles.length - 1 < (i / 6) % mondrian_count) {
            mondrian_profiles.push([0, 0])
        }
        // Push locations and values
        mondrian_profiles[(i / 6) % mondrian_count].push(stringSafe(x - 0.00001), 0, x,
            thisAlpha, x2, thisAlpha, stringSafe(x2 + 0.00001), 0);
    }
    return mondrian_profiles;
}

function CreateStimulusProfiles(stimulus_flips, pause_flips, cover_flips) {
    let stimulus_profiles = [];
    for (let i = 6; i < stimulus_flips; i += 6) [
        stimulus_profiles[(i / 6) % mondrian_count].push(stringSafe(x - 0.00001), 0, x,
            thisAlpha, x2, thisAlpha, stringSafe(x2 + 0.00001), 0)
    ]
}

//Draw stimulus
function CreateStimulusContext(_id, stimulus, stimulus_vertical_flip, frameWidth, frameHeight, stimulus_width,
                               stimulus_height, stimulus_side, trial_stimulus, start_trial, stimulus_delay,
                               start_compute, fixationWidth) {
    let stimulus_canvas = document.getElementById("stimulus");
    let stimulus_context = stimulus_canvas.getContext(_id);
    if (stimulus_vertical_flip) {
        stimulus_context.translate(0, frameHeight);
        stimulus_context.scale(1, -1);
    }
    let stimulus_location;
    if (stimulus_side === 0) {
        stimulus_location = (3 * frameWidth / 4) - (frameHeight / 2);
    } else if (stimulus_side === 1) {
        stimulus_location = (frameWidth / 4) - (frameHeight / 2);
    } else if (stimulus_side === 2) {
        stimulus_location = 0;
    } else if (stimulus_side === 3) {
        stimulus_location = (frameHeight / 2) + (fixationWidth / 2) + 5;
        // stimulus_location = -1 * stimulus_location;
    }

    let img = new Image();

    img.id = 'stimulusImg';
    console.log(trial_stimulus);
    img.src = trial_stimulus;
    img.onload = function () {
        if (stimulus_side > 1) {
            stimulus_context.drawImage(img, 0, stimulus_location,
                stimulus_width, stimulus_height);
        } else {
            stimulus_context.drawImage(img, stimulus_location, 0,
                stimulus_width, stimulus_height);

        }
        setTimeout(start_trial, 1000 * stimulus_delay - (Date.now() - start_compute));
    };
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
    //The maximum is exclusive and the minimum is inclusive
}

//Get Stimulus side
function GetStimulusSide(trial_stimulus_side, orientation = 'h') {
    if (trial_stimulus_side >= 0) {
        return trial_stimulus_side
    } else {
        let max_int = 2;
        let min_int = 0;
        if ((orientation === 'v') || (orientation === 'b')) {
            max_int = 4;
            if (orientation === 'v') {
                min_int = 2;
            }
        }
        return getRandomInt(min_int, max_int);
    }
}

function stringSafe(n) {
    return (n < 0.00001 && n > -0.00001) ? 0 : n;
} // Makes sure no too small values mess up the SVG animation path

//Create Cover
function CreateCover(_id, _className, _frameWidth, _frameHeight, _zIndex,
                     _position, _opacity) {
    let cover = document.createElement('canvas');
    cover.id = _id;
    cover.className = _className;
    cover.width = _frameWidth + 150;
    cover.height = _frameHeight + 150;
    cover.style.zIndex = _zIndex;
    cover.style.position = _position;
    cover.style.opacity = _opacity;
    return cover;
}

//Create Cover Context
function CreateCoverContext(_id, _cover, _fillStyle, _x, _y, _frameWidth,
                            frameHeight) {
    let ctx = document.getElementById("cover").getContext(_id);
    ctx.fillStyle = _fillStyle;
    ctx.fillRect(_x, _y, _frameWidth + 150, frameHeight + 150);
    return ctx;
}

//Create Cover Text
function CreateCoverText(_id, _className, _innerHTML, zIndex, _position, _top,
                         _transform) {
    let cover_text = document.createElement('div');
    cover_text.id = _id;
    cover_text.className = _className;
    cover_text.innerHTML = _innerHTML;
    cover_text.style.zIndex = zIndex;
    cover_text.style.position = _position;
    cover_text.style.top = _top;
    cover_text.style.transform = _transform;
    return cover_text;
}
