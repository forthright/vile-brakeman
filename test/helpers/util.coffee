Promise = require "bluebird"

issues = [
  {
    path: "app/models/a_model.rb",
    title: "Mass Assignment",
    message: "Potentially dangerous attribute available for " +
         "mass assignment (Confidence: Weak)",
    type: "security"
    signature: "brakeman::xyz"
    advisory: "http://brakemanscanner.org/docs/warning_types/mass_assignment/",
    where: {}
  }
  {
    path: "app/views/issues/index.html.slim"
    title: "Dynamic Render Path",
    message: "Render path contains parameter value" +
             " (Confidence: Weak)",
    signature: "brakeman::9aab84544cdb8287a2af08623f0a9fc" +
                "fabc904b816c1c633ef797d1be0ee9994",
    type: "security",
    advisory: "http://brakemanscanner.org/docs/warning_types/" +
              "dynamic_render_path/"
    where: { start: { line: 21 } }
  }
  {
    path: "config/routes.rb",
    title: "Default Routes",
    message: "All public methods in controllers are available " +
         "as actions in routes.rb (Confidence: High)",
    type: "security",
    signature: "brakeman::abcd",
    advisory: "http://brakemanscanner.org/docs/warning_types/default_routes/",
    where: { start: { line: 34 } }
  }
  {
    path: "",
    title: "Error",
    advisory: undefined,
    message: "app/controllers/some_controller.rb:7 " +
         ":: parse error on value \"-\" (tOP_ASGN)",
    type: "error",
    signature: "brakeman::app/controllers/some_controller.rb:7 " +
             ":: parse error on value \"-\" (tOP_ASGN)",
    where: {}
  }
]

brakeman_json =
  {
    warnings: [
      {
        warning_type: "Mass Assignment"
        warning_code: 60
        fingerprint: "xyz"
        message: "Potentially dangerous attribute available for mass assignment"
        file: "app/models/a_model.rb"
        line: undefined
        link: "http://brakemanscanner.org/docs/warning_types/mass_assignment/"
        code: ":some_attr"
        render_path: undefined
        location: {
          type: "model"
          model: "AModel"
        }
        user_input: undefined
        confidence: "Weak"
      }
      {
        warning_type: "Dynamic Render Path"
        warning_code: 15
        fingerprint: "9aab84544cdb8287a2af08623f0a" +
                      "9fcfabc904b816c1c633ef797d1be0ee9994"
        message: "Render path contains parameter value"
        file: "app/views/issues/index.html.slim"
        line: 21
        link: "http://brakemanscanner.org/docs/warning_types" +
              "/dynamic_render_path/"
        code: ".."
        render_path: [
          {
            type: "controller",
            class: "IssuesController",
            method: "index",
            line: 20,
            file: "app/controllers/issues_controller.rb"
          }
        ]
        location: {
          type: "template",
          template: "issues/index"
        }
        user_input: "params[:page]"
        confidence: "Weak"
      }
      {
        warning_type: "Default Routes"
        warning_code: 11
        fingerprint: "abcd"
        message: "All public methods in controllers are " +
                 "available as actions in routes.rb"
        file: "config/routes.rb"
        line: 34
        link: "http://brakemanscanner.org/docs/warning_types/default_routes/"
        code: undefined
        render_path: undefined
        location: undefined
        user_input: undefined
        confidence: "High"
      }
    ]
    ignored_warnings: [ ],
    errors: [{
      "error": "app/controllers/some_controller.rb:7 " +
               ":: parse error on value \"-\" (tOP_ASGN)",
      "location": "Could not parse app/controllers/some_controller.rb"
    }],
    scan_info: {
      app_path: "/some_path",
      rails_version: "4.2.1",
      security_warnings: 2,
      start_time: "2015-09-06 20:52:16 -0400",
      end_time: "2015-09-06 20:52:20 -0400",
      duration: 2,
      checks_performed: [ "...", ],
      number_of_controllers: 1,
      number_of_models: 2,
      number_of_templates: 0,
      ruby_version: "2.2.2",
      brakeman_version: "3.0.5"
    }
  }

setup = (vile) ->
  vile.spawn.returns new Promise (resolve) ->
    resolve JSON.stringify brakeman_json

module.exports =
  issues: issues
  setup: setup
