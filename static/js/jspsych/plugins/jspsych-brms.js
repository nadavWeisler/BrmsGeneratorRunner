jsPsych.plugins["bRMS"] = (function () {
    let plugin = {};

    plugin.info = {
        name: 'bRMS',
        description: '',
        parameters: {
            visUnit: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Visual unit size',
                default: 1,
                description: "Multiplier for manual stimulus size adjustment. Should be\
         deprecated with new jspsych's native solution."
            },
            colorOpts: {
                type: jsPsych.plugins.parameterType.COMPLEX,
                pretty_name: 'Color palette',
                default: ['#FF0000', '#00FF00', '#0000FF',
                    '#FFFF00', '#FF00FF', '#00FFFF'
                ],
                description: "Colors for the Mondrian"
            },
            count: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Experiment count',
                default: 0,
                description: ""
            },
            rectNum: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Rectangle number',
                default: 500,
                description: "Number of rectangles in Mondrian"
            },
            mondrianNum: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Mondrian number',
                default: 50,
                description: "Number of unique mondrians to create"
            },
            mondrian_max_opacity: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Mondrian maximum contrast',
                default: 1,
                description: "Maximum contrast value for the Mondrian mask."
            },
            timing_response: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Timing response',
                default: 0,
                description: "Maximum time duration allowed for response"
            },
            choices: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Response choices',
                default: ['d', 'k']
            },
            stimulus_block: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Stimulus Block',
                default: ""
            },
            stimulus_vertical_flip: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Vertical flip stimulus',
                default: 0,
            },
            stimulus_opacity: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Stimulus maximum opacity',
                default: 0.5
            },
            stimulus_side: {
                type: jsPsych.plugins.parameterType.INT,
                default: -1,
                description: "Stimulus side: 1 is right, 0 is left. -1 is random"
            },
            stimulus_delay: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Within plugin ITI',
                default: 0,
                description: "Duration of ITI reserved for making sure stimulus image\
                 is loaded."
            },
            stimulus_duration: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: '',
                default: 1000,
                description: ""
            },
            gap_duration: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: '',
                default: 1000,
                description: ""
            },
            mask_duration: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: '',
                default: 5000,
                description: ""
            },
            stimulus_width: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 61,
                description: 'stimulus width constant, multiply by visUnit'
            },
            stimulus_height: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 61,
                description: 'stimulus height constant, multiply by visUnit'
            },
            fade_out_time: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Fade out time',
                default: 0,
                description: "When to start fading out mask. 0 is never."
            },
            fade_in_time: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Fade in time',
                default: 0,
                description: "Duration of stimulus fade in."
            },
            bigProblemDuration: {
                type: jsPsych.plugins.parameterType.INT,
                default: 100,
                description: 'If a frame is presented for more than x ms, regard the \
                    trial as a big problem'
            },
            smallProblemStimDuration: {
                type: jsPsych.plugins.parameterType.INT,
                default: 40,
                description: 'Stimulus presentation criterion for small problem'
            },
            smallProblemMondDuration: {
                type: jsPsych.plugins.parameterType.INT,
                default: 50,
                description: 'Mondrian presentation criterion for small problem'
            },
            includeVBLinData: {
                type: jsPsych.plugins.parameterType.BOOL,
                default: false,
                description: 'Whether to include vbl array in data: increases memory \
                    requirements.'
            },
            fixation_visible: {
                type: jsPsych.plugins.parameterType.BOOL,
                default: true,
                description: 'Boolean to show fixation'
            },
            rectangle_width: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 6,
                description: 'rWidth constant, multiply by visUnit'
            },
            rectangle_height: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 6,
                description: 'rHeight constant, multiply by visUnit'
            },
            fixation_width: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: (25 / 3),
                description: 'fixation length constant, multiply by visUnit'
            },
            fixation_height: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 2.34,
                description: 'fixation height constant, multiply by visUnit'
            },
            frame_width: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 150,
                description: 'frame width constant, multiply by visUnit'
            },
            frame_height: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 63,
                description: 'frame height constant, multiply by visUnit'
            },
            block: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 63,
                description: 'Current trial block'
            },
            sub_block: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 63,
                description: 'Current trial sub block'
            },
            Hz: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 60,
                description: 'stimulus fps'
            },
            background_color: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                default: "darkgray",
                description: 'Background color'
            },
            test_mode: {
                type: jsPsych.plugins.parameterType.BOOL,
                default: false,
                description: 'If is Test bRMS'
            },
            correct_answer: {
                type: jsPsych.plugins.parameterType.BOOL,
                default: false,
                description: 'If is Test bRMS'
            }
        }
    };

    jsPsych.pluginAPI.registerPreload('bRMS', 'stimulus', 'image');

    /**
     * JavaScript Client Detection
     * (C) viazenetti GmbH (Christian Ludwig)
     */
    function update_client() {
        let unknown = '-';

        // screen
        let screenResolution = '';

        let width;
        let height;
        if (screen.width) {
            width = window.screen.width * window.devicePixelRatio ?
                window.screen.width * window.devicePixelRatio : '';
            height = window.screen.height * window.devicePixelRatio ?
                window.screen.height * window.devicePixelRatio : '';
            screenResolution += '' + width + " x " + height;
        }

        // browser
        let nVer = navigator.appVersion;
        let nAgt = navigator.userAgent;
        let browser = navigator.appName;
        let version = '' + parseFloat(navigator.appVersion);
        let majorVersion = parseInt(navigator.appVersion, 10);
        let nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) !== -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // Edge
        else if ((verOffset = nAgt.indexOf('Edge')) !== -1) {
            browser = 'Microsoft Edge';
            version = nAgt.substring(verOffset + 5);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') !== -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() === browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) !== -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) !== -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) !== -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        let mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        let cookieEnabled = (navigator.cookieEnabled);

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
        }
        // system
        let os = unknown;
        let clientStrings = [
            {s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
            {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
            {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
            {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
            {s: 'Windows Vista', r: /Windows NT 6.0/},
            {s: 'Windows Server 2003', r: /Windows NT 5.2/},
            {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
            {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
            {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
            {s: 'Windows 98', r: /(Windows 98|Win98)/},
            {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
            {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s: 'Windows CE', r: /Windows CE/},
            {s: 'Windows 3.11', r: /Win16/},
            {s: 'Android', r: /Android/},
            {s: 'Open BSD', r: /OpenBSD/},
            {s: 'Sun OS', r: /SunOS/},
            {s: 'Chrome OS', r: /CrOS/},
            {s: 'Linux', r: /(Linux|X11(?!.*CrOS))/},
            {s: 'iOS', r: /(iPhone|iPad|iPod)/},
            {s: 'Mac OS X', r: /Mac OS X/},
            {s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s: 'QNX', r: /QNX/},
            {s: 'UNIX', r: /UNIX/},
            {s: 'BeOS', r: /BeOS/},
            {s: 'OS/2', r: /OS\/2/},
            {s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        let osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            } else {
                flashVersion = unknown;
            }
        }


        window.jscd = {
            screenResolution: screenResolution,
            browser: browser,
            browserVersion: version,
            browserMajorVersion: majorVersion,
            mobile: mobile,
            os: os,
            osVersion: osVersion,
            cookies: cookieEnabled,
            flashVersion: flashVersion
        };
    }

    plugin.trial = function (display_element, trial) {
        // Clear previous
        display_element.innerHTML = '';
        setTimeout(function () {
            // Start timing for within trial ITI
            let startCompute = Date.now();

            // Hide mouse
            let stylesheet = document.styleSheets[0];
            stylesheet.insertRule("* {cursor: none;}", stylesheet.cssRules.length);
            const div_length = document.getElementById("dpiDiv").clientHeight;
            const rectangleWidth = trial.rectangle_width * div_length;
            const rectangleHeight = trial.rectangle_height * div_length;
            const fixationWidth = trial.fixation_width * div_length;
            const fixationHeight = trial.fixation_height * div_length;
            const frameWidth = trial.frame_width * div_length;
            const frameHeight = trial.frame_height * div_length;
            const stimulusWidth = trial.stimulus_width * div_length;
            const stimulusHeight = trial.stimulus_height * div_length;

            let orientation = 'h';
            if (frameHeight > frameWidth) {
                orientation = 'v';
            }

            const stimulus_side = GetStimulusSide(trial.stimulus_side, orientation);

            // this array holds handlers from setTimeout calls
            // that need to be cleared if the trial ends early
            let setTimeoutHandlers = [];
            update_client();
            // store response
            let response = {
                rt: -1,
                key: -1
            };

            const end_trial = function () {
                // timelineMax.remove();
                // // kill the animation
                // timelineMax.kill();

                // kill any remaining setTimeout handlers
                for (var i = 0; i < setTimeoutHandlers.length; i++) {
                    clearTimeout(setTimeoutHandlers[i]);
                }

                // kill keyboard listeners
                if (typeof keyboardListener !== 'undefined') {
                    jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                }

                // Analyse animation performance
                tvbl = {};
                tvbl['time'] = vbl['time'].filter(function (value, index) {
                    return vbl['mondrian_number'][index] >= 0;
                });
                tvbl['mondrian_number'] = vbl['mondrian_number'].filter(function (value, index) {
                    return vbl['mondrian_number'][index] >= 0
                });
                tvbl['mondrian_alpha'] = vbl['mondrian_alpha'].filter(function (value, index) {
                    return vbl['mondrian_number'][index] >= 0
                });

                tvbl['refresh'] = [];
                for (i = 0; i < tvbl['time'].length; i++) {
                    tvbl['refresh'].push(tvbl['time'][i + 1] - tvbl['time'][i]);
                } // get differential time stamps

                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                } // get unique mondrian numbers

                mond = {}; // represent vbl per mondrian
                mond['nums'] = tvbl['mondrian_number'].filter(onlyUnique);

                mond['mondrian_duration'] = [];
                mond['stimulus_duration'] = [];
                for (i = 0; i < mond['nums'].length; i++) {
                    mond['mondrian_duration'].push(tvbl['refresh'].filter(function (value, index) {
                        return tvbl['mondrian_number'][index] === mond['nums'][i] && tvbl['mondrian_alpha'][index] > 0
                    }).reduce((a, b) => a + b, 0));
                    mond['stimulus_duration'].push(tvbl['refresh'].filter(function (value, index) {
                        return tvbl['mondrian_number'][index] === mond['nums'][i] &&
                            tvbl['mondrian_alpha'][index] === 0
                    }).reduce((a, b) => a + b, 0));
                }
                // some vbl refresh separately for mondrian and stim for each presentation

                bProblem = mond['nums'].filter(function (value, index) {
                    return mond['mondrian_duration'][index] > trial.bigProblemDuration & value > 0 ||
                        mond['stimulus_duration'][index] > trial.bigProblemDuration
                }).length; // Count instances of lag in animation
                sProblem = mond['nums'].filter(function (value, index) {
                    return mond['stimulus_duration'][index] > trial.smallProblemStimDuration &&
                        (mond['mondrian_duration'][index] < trial.smallProblemMondDuration ||
                            mond['mondrian_duration'][index + 1] < trial.smallProblemMondDuration)
                }).length; // Count instances of stimulus presented for too long.

                let fullscreen = false;
                if ((window.fullScreen) ||
                    (window.innerWidth === screen.width && window.innerHeight === screen.height)) {
                    fullscreen = true;
                }
                let keyPress = String.fromCharCode(response.key);
                if (!/^[a-zA-Z]+$/.test(keyPress)) {
                    keyPress = "-1"
                }
                // gather the data to store for the trial
                let trial_data = {
                    "rt": response.rt,
                    "stimulus": trial.file,
                    "stimulus_block": trial.stimulus_block,
                    "stimulus_side": stimulus_side,
                    "key_press": keyPress,
                    "time_post_trial": trial.post_trial_gap,
                    "subject": trial.count + 1,
                    "is_fullscreen": fullscreen,
                    "trial_began": trial_began,
                    'os': window.jscd.os + ' ' + window.jscd.osVersion,
                    'browser': jscd.browser + ' ' + window.jscd.browserMajorVersion +
                        ' (' + window.jscd.browserVersion + ')',
                    'mobile': window.jscd.mobile,
                    'flash': window.jscd.flashVersion,
                    'cookies': window.jscd.cookies,
                    'screen_size': window.jscd.screen,
                    'block': trial.block,
                    'sub_block': trial.sub_block
                };

                if (trial.includeVBLinData) {
                    trial_data.vbl = vbl;
                }

                // clear the display
                display_element.innerHTML = '';

                // Return mouse
                stylesheet.deleteRule(stylesheet.cssRules.length - 1);

                // move on to the next trial
                setTimeout(function () {
                    jsPsych.finishTrial(trial_data);
                }, 10);

            };

            // function to handle responses by the subject
            let after_response = function (info) {

                // only record the first response
                if (response.key === -1) {
                    response = info;
                }

                end_trial();
            };
            let isStare = trial.stimulus_duration === 0;
            //Function for start experiment
            let start_trial = function () {
                console.log("start_trial");
                if (trial.fixation_visible) {
                    fixation.style.visibility = "visible";
                } else {
                    fixation.style.visibility = "hidden";
                }

                const startTime = new Date().getTime() / 1000;
                const start_fade_out = trial.timing_response - trial.fade_out_time;
                const fade_out_time = trial.fade_out_time * 1000;
                stimulus.style.opacity = 0;
                let hidden = false;
                let changeMask = false;
                if (trial.stimulus_duration !== 0) {
                    isStare = false;
                }

                function resetMondrian() {
                    for (let i = 0; i < mondrian_list.length; i++) {
                        mondrian_list[i].style.opacity = 0;
                    }
                }

                stimulus.style.visibility = "visible";

                function stare(index = 0) {
                    changeMask = !changeMask;
                    let current_time = ((new Date().getTime() / 1000) - startTime);
                    if (changeMask) {
                        resetMondrian();
                        if (current_time > start_fade_out) {
                            mondrian_list[index].style.opacity = trial.mondrian_max_opacity -
                                ((current_time - start_fade_out) / fade_out_time * 1000) * trial.mondrian_max_opacity;
                        } else {
                            mondrian_list[index].style.opacity = trial.mondrian_max_opacity;
                        }
                    } else {
                        if (current_time < trial.fade_in_time) {
                            stimulus.style.opacity = (current_time / (trial.fade_in_time)) *
                                trial.stimulus_opacity;
                        } else {
                            stimulus.style.opacity = trial.stimulus_opacity;
                        }
                    }
                    if (current_time < 10) {
                        setTimeout(function () {
                            stare(((index + 1) % mondrian_list.length))
                        }, changeMask ? trial.mask_duration : trial.stimulus_duration);
                    }
                }

                function blink(index = 0) {
                    stimulus.style.visibility = hidden ? "visible" : "hidden";
                    hidden = !hidden;
                    let stimulusOpacity, mondrianOpacity;
                    let current_time = ((new Date().getTime() / 1000) - startTime);

                    if (hidden) {
                        mondrianOpacity = trial.mondrian_max_opacity;
                        if (current_time > start_fade_out) {
                            mondrianOpacity = trial.mondrian_max_opacity -
                                ((current_time - start_fade_out) / fade_out_time * 1000) * trial.mondrian_max_opacity;
                        }
                        mondrian_list[index].style.opacity = mondrianOpacity;
                    } else {
                        stimulusOpacity = trial.stimulus_opacity;
                        resetMondrian();
                        if (current_time < trial.fade_in_time) {
                            stimulusOpacity = (current_time / (trial.fade_in_time)) * trial.stimulus_opacity;
                        }
                        stimulus.style.opacity = stimulusOpacity;
                    }
                    if (current_time < 10) {
                        setTimeout(function () {
                            blink(((index + 1) % mondrian_list.length))
                        }, hidden ? trial.mask_duration : trial.stimulus_duration);
                    }
                }

                if (isStare) {
                    stare();
                } else {
                    blink();
                }

                // start the response listener
                if (JSON.stringify(trial.choices) !== JSON.stringify(["none"])) {
                    let keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                        callback_function: after_response,
                        valid_responses: trial.choices,
                        rt_method: 'performance',
                        persist: false,
                        allow_held_key: false
                    });
                }
            };

            // Make display and animation
            // end trial if time limit is set
            if (trial.timing_response > 0) {
                const t2 = setTimeout(function () {
                    end_trial();
                }, trial.timing_response * 1000);
                setTimeoutHandlers.push(t2);
            }

            // Add Fixation Canvas to display elements
            let fixation = CreateNewCanvas('fixation', 'jspsych-brms-frame',
                frameWidth, frameHeight, 3, "absolute",
                "0px double #000000", "hidden", 1);

            display_element.append(fixation);

            //Draw fixation on Fixation Canvas
            CreateFixationContext("2d", 'black', frameWidth,
                fixationWidth, frameHeight, fixationHeight, fixation);

            let stimulus_layer, mask_layer;
            if (isStare) {
                mask_layer = 1;
                stimulus_layer = 2;
            } else {
                mask_layer = 2;
                stimulus_layer = 1;
            }

            // Make mondrian list
            let mondrian = [];
            let mondrian_list = [];
            for (let i = 0; i < trial.mondrianNum; i++) {
                mondrian = CreateMondrian("mondrian" + i, 'jspsych-brms-frame',
                    frameWidth, frameHeight, mask_layer, "absolute",
                    "0px double #000000", 0);
                mondrian_list.push(mondrian);
                display_element.append(mondrian_list[i]);

                let ctx = CreateMondrianContext("2d", mondrian, trial.background_color,
                    0, 0, frameWidth, frameHeight);

                // Fill rect
                FillRectangles(trial.rectNum, ctx, trial.colorOpts,
                    rectangleWidth, rectangleHeight, frameWidth, frameHeight);
            }

            // Add Stimulus Canvas to display elements
            const stimulus = CreateNewCanvas('stimulus', 'jspsych-brms-frame',
                frameWidth, frameHeight, stimulus_layer, "absolute",
                "0px #000000", "visible", 0);
            display_element.append(stimulus);

            //Add border
            display_element.append(CreateNewCanvas('border', 'jspsych-brms-frame',
                frameWidth, frameHeight, 0, "absolute",
                "20px double #000000", "visible", 1));

            // Animation
            let trialLength = trial.timing_response;
            let maxFlips = trialLength * trial.Hz;
            let fade_out_flip = trial.fade_out_time * trial.Hz;
            let regularFlip = (trialLength - trial.fade_out_time) * trial.Hz;

            // Create a timeline
            let vbl = {
                time: [],
                mondrian_alpha: [],
                mondrian_number: []
            };
            let trial_began = 0;
            let d = new Date();
            let j = 0;
            let timelineMax = new TimelineMax({
                paused: true,
                onUpdate: function () {
                    let op1 = parseFloat(mondrian_list[j % trial.mondrianNum].style.opacity),
                        op2 = parseFloat(mondrian_list[(j + 1) % trial.mondrianNum].style.opacity);
                    if (op1 === 0 && op2 > 0) {
                        j++
                    }

                    vbl['time'].push(Math.round(performance.now()));
                    vbl['mondrian_alpha'].push(op1 + op2);
                    vbl['mondrian_number'].push(j);
                },
                onStart: function () {
                    let op1 = parseFloat(mondrian_list[1 % trial.mondrianNum].style.opacity),
                        op2 = parseFloat(mondrian_list[(1 + 1) % trial.mondrianNum].style.opacity);

                    trial_began = d.getTime();
                    vbl['time'].push(Math.round(performance.now()));
                    vbl['mondrian_alpha'].push(op1 + op2);
                    vbl['mondrian_number'].push(-1);
                },
            });

            // timelineMax.clear();
            //
            // timelineMax.to(stimulus, trial.fade_in_time, {
            //     opacity: trial.stimulus_opacity
            // });

            /// Create mondrian's alpha profile
            let mondrian_profiles = CreateMondrianProfiles(maxFlips, fade_out_flip,
                regularFlip, trial.mondrian_max_opacity,
                trial.Hz, trial.fade_out_time, trial.mondrianNum,
                trial.stimulus_duration, trial.mask_duration);

            // Make into eases and add to timeline
            for (let i = 0; i < mondrian_profiles.length; i++) {
                if (mondrian_profiles[i][mondrian_profiles[i].length - 2] > 1) {
                    mondrian_profiles[i].splice(mondrian_profiles[i].length - 2, 2); //remove the last 2 points
                } else if (mondrian_profiles[i][mondrian_profiles[i].length - 2] < 1) {
                    mondrian_profiles[i].push(1, 0);
                }
                // Create ease
                //CustomEase.create("mondrian" + i, "M0,0 L" + mondrian_profiles[i].join(","));
                // //Add to timeline
                // timelineMax.add(TweenMax.to(mondrian_list[i], trialLength, {
                //     opacity: trial.mondrian_max_opacity,
                //     ease: "mondrian" + i
                // }), 0);
            }

            //Draw stimulus on Stimulus Canvas
            CreateStimulusContext("2d", stimulus, trial.stimulus_vertical_flip,
                frameWidth, frameHeight, stimulusWidth, stimulusHeight, stimulus_side,
                trial.stimulus, start_trial(), trial.stimulus_delay, startCompute, fixationWidth);
        }, 10);
    };
    return plugin;
})
();
