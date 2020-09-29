jsPsych.plugins["bRMS-test"] = (function () {

    let plugin = {};

    plugin.info = {
        name: 'bRMS-test',
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
            stimulus_alpha: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Stimulus maximum opacity',
                default: 0.5
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
            stimulus_vertical_flip: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Vertical flip stimulus',
                default: 0,
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
            fade_out_length: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Fade out duration',
                default: 0,
                description: "Duration of mask fade out."
            },
            within_ITI: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Within plugin ITI',
                default: 0,
                description: "Duration of ITI reserved for making sure stimulus image\
                 is loaded."
            },
            mondrian_max_alpha: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Mondrian maximum contrast',
                default: 1,
                description: "Maximum contrast value for the Mondrian mask."
            },
            stimulus_side: {
                type: jsPsych.plugins.parameterType.INT,
                default: -1,
                description: "Stimulus side: 1 is right, 0 is left. -1 is random"
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
            r_width_constant: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 6,
                description: 'rWidth constant, multiply by visUnit'
            },
            r_height_constant: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 6,
                description: 'rHeight constant, multiply by visUnit'
            },
            fixation_width_constant: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: (25 / 3),
                description: 'fixation length constant, multiply by visUnit'
            },
            fixation_height_constant: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 2.34,
                description: 'fixation height constant, multiply by visUnit'
            },
            frame_width_constant: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 150,
                description: 'frame width constant, multiply by visUnit'
            },
            frame_height_constant: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 63,
                description: 'frame height constant, multiply by visUnit'
            },
            stimulus_width_constant: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 61,
                description: 'stimulus width constant, multiply by visUnit'
            },
            stimulus_height_constant: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 61,
                description: 'stimulus height constant, multiply by visUnit'
            },
            Hz: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 60,
                description: 'stimulus Hz'
            },
            orientation: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                default: "h",
                description: 'orientation'
            },
            mond_max_alpha: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Mondrian maximum contrast',
                default: 1,
                description: "Maximum contrast value for the Mondrian mask."
            },
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                default: "<p>Testing for the \
        compatibility of your personal computer with this HIT</p>."
            }
        }
    };

    jsPsych.pluginAPI.registerPreload('bRMS', 'stimulus', 'image');

    plugin.trial = function (display_element, trial) {

        // Clear previous
        display_element.innerHTML = '';

        setTimeout(function () {

            // Start timing for within trial ITI
            let startCompute = Date.now();

            // Hide mouse
            let stylesheet = document.styleSheets[0];
            stylesheet.insertRule("* {cursor: none;}",
                stylesheet.cssRules.length);

            let rectangleWidth = Math.min(trial.r_width_constant,
                trial.r_height_constant) * trial.visUnit,
                rectangleHeight = Math.max(trial.r_width_constant,
                    trial.r_height_constant) * trial.visUnit,
                fixationWidth = trial.fixation_width_constant * trial.visUnit,
                fixationHeight = trial.fixation_height_constant * trial.visUnit,
                frameWidth = trial.frame_width_constant * trial.visUnit,
                frameHeight = trial.frame_height_constant * trial.visUnit,
                stimulusWidth = trial.stimulus_width_constant * trial.visUnit,
                stimulusHeight = trial.stimulus_height_constant * trial.visUnit;

            let stimulus_side = 0;
            if (trial.stimulus_side < 0) {
                stimulus_side = Math.round(Math.random());
            } else {
                stimulus_side = trial.stimulus_side;
            }

            // this array holds handlers from setTimeout calls
            // that need to be cleared if the trial ends early
            let setTimeoutHandlers = [];

            // store response
            let response = {
                rt: -1,
                key: -1
            };

            // function to end trial when it is time
            let end_trial = function () {

                // kill the animation
                tl.kill();

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
                    return vbl['mondrian_number'][index] >= 0
                }),
                    tvbl['mondrian_number'] = vbl['mondrian_number'].filter(function (value, index) {
                        return vbl['mondrian_number'][index] >= 0
                    }),
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

                mond['mond_duration'] = [];
                mond['stim_duration'] = [];
                for (i = 0; i < mond['nums'].length; i++) {
                    mond['mond_duration'].push(tvbl['refresh'].filter(function (value, index) {
                        return tvbl['mondrian_number'][index] == mond['nums'][i] &&
                            tvbl['mondrian_alpha'][index] > 0
                    }).reduce((a, b) => a + b, 0)),
                        mond['stim_duration'].push(tvbl['refresh'].filter(function (value, index) {
                            return tvbl['mondrian_number'][index] == mond['nums'][i] &&
                                tvbl['mondrian_alpha'][index] == 0
                        }).reduce((a, b) => a + b, 0));
                } // some vbl refresh seperately for mondrian and stim for each presentation

                bProblem = mond['nums'].filter(function (value, index) {
                    return mond['mond_duration'][index] > trial.bigProblemDuration & value > 0 ||
                        mond['stim_duration'][index] > trial.bigProblemDuration
                }).length; // Count instances of lag in animation

                sProblem = mond['nums'].filter(function (value, index) {
                    return mond['stim_duration'][index] > trial.smallProblemStimDuration &&
                        (mond['mond_duration'][index] < trial.smallProblemMondDuration ||
                            mond['mond_duration'][index + 1] < trial.smallProblemMondDuration)
                }).length; // Count instances of stimulus presented for too long.

                // gather the data to store for the trial
                var trial_data = {
                    "rt": response.rt,
                    "stimulus": trial.stimulus,
                    "stimulus_side": stimulus_side,
                    "key_press": response.key,
                    "acc": (response.key == 68 & stimulus_side == 0) |
                        (response.key == 75 & stimulus_side == 1),
                    'animation_performance': mond,
                    'bProblem': bProblem,
                    'sProblem': sProblem,
                    'trial_began': trial_began
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
            let after_response;
            after_response = function (info) {

                // only record the first response
                if (response.key === -1) {
                    response = info;
                }

                end_trial();
            };

            let start_trial = function () {
                fixation.style.visibility = "visible";

                // end trial if time limit is set
                if (trial.timing_response > 0) {
                    let t2 = setTimeout(function () {
                        end_trial();
                    }, trial.timing_response * 1000);
                    setTimeoutHandlers.push(t2);
                }

                tl.play();

                // start the response listener
                if (JSON.stringify(trial.choices) !== JSON.stringify(["none"])) {
                    console.log('here');
                    let keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                        callback_function: after_response,
                        valid_responses: trial.choices,
                        rt_method: 'performance',
                        persist: false,
                        allow_held_key: false
                    });
                }
            };

            // Draw fixation
            let fixation = CreateFixation('fixation',
                'jspsych-brms-frame', frameWidth,
                frameHeight, 2, "absolute",
                "20px double #000000", "hidden");

            display_element.append(fixation);

            CreateFixationContext("2d", 'black', frameWidth, fixationWidth,
                frameHeight, fixationHeight, fixation);


            // Make mondrian list
            let mondrian = [];
            let mondrian_list = [];
            for (let i = 0; i < trial.mondrianNum; i++) {
                mondrian = CreateMondrian("mondrian" + i,
                    'jspsych-brms-frame', frameWidth, frameHeight,
                    1, "absolute",
                    "20px double #000000", 0);
                mondrian_list.push(mondrian);
                display_element.append(mondrian_list[i]);

                let ctx = CreateMondrianContext("2d", mondrian,
                    'grey', 0, 0, frameWidth, frameHeight);

                // Fill rect
                FillRectangles(trial.rectNum, ctx, trial.colorOpts,
                    rectangleWidth, rectangleHeight, frameWidth, frameHeight);
            }

            // Draw stimulus
            let stimulus = CreateStimulus('stimulus',
                'jspsych-brms-frame', frameWidth,
                frameHeight, 0, "absolute",
                "20px double #000000", 0);

            display_element.append(stimulus);

            // Cover it all

            let cover = CreateCover("cover",
                'jspsych-brms-frame', frameWidth, frameHeight,
                3, "absolute", 1);
            display_element.append(cover);

            CreateCoverContext("2d", cover, 'white', 0, 0,
                frameWidth, frameHeight);

            let cover_text = CreateCoverText('cover_text',
                'jspsych-html-keyboard-response-stimulus',
                trial.prompt, 4, "absolute", "50%",
                "translate(-50%, -50%)");

            display_element.append(cover_text);

            // Animation

            let trialLength = Math.max(trial.fade_out_time +
                trial.fade_out_length,
                trial.timing_response);
            let maxFlips = trialLength * trial.Hz;

            // Create a timeline
            let vbl = {
                time: [],
                mondrian_alpha: [],
                mondrian_number: []
            };
            let trial_began = 0;
            let d = new Date();
            let j = 0;
            let tl = new TimelineMax({
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
                }
            });

            tl.to(stimulus, trial.fade_in_time, {
                opacity: trial.stimulus_alpha
            });

            /// Create mondrian's alpha profile
            let mondrian_profiles = CreateMondrianProfiles(maxFlips,
                trial.mondrian_max_alpha, trial.Hz,
                trial.fade_out_time, trial.mondrianNum);

            // Make into eases and add to timeline
            for (let i = 0; i < mondrian_profiles.length; i++) {
                if (mondrian_profiles[i][mondrian_profiles[i].length - 2] > 1) {
                    mondrian_profiles[i].splice(mondrian_profiles[i].length - 2, 2); //remove the last 2 points
                } else if (mondrian_profiles[i][mondrian_profiles[i].length - 2] < 1) {
                    mondrian_profiles[i].push(1, 0);
                }

                // Create ease
                CustomEase.create("mondrian" + i, "M0,0 L" +
                    mondrian_profiles[i].join(","));

                //Add to timeline
                tl.add(TweenMax.to(mondrian_list[i], trialLength, {
                    opacity: trial.mondrian_max_alpha,
                    ease: "mondrian" + i
                }), 0);
            }

            CreateStimulusContext("2d", stimulus,
                trial.stimulus_vertical_flip,
                frameWidth, frameHeight, stimulusWidth, stimulusHeight,
                stimulus_side, trial.stimulus, start_trial(),
                trial.within_ITI, startCompute);

        }, 10);
    };

    return plugin;
})();