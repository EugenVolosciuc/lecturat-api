function checkBodyParams(arr) {
    return function (req, res, next) {
        // Make sure each param listed in arr is present in req.body
        var missing_params = [];
        for (var i = 0; i < arr.length; i++) {
            if (!eval("req.body." + arr[i])) {
                missing_params.push(arr[i]);
            }
        }
        if (missing_params.length == 0) {
            next();
        } else {
            res.status(400).json({ "error": "Params missing error", "message": "Parameter(s) missing: " + missing_params.join(", ") });
        }
    }
}

module.exports = { checkBodyParams }