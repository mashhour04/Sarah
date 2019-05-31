const log = require('npmlog');
class Ensure {
    constructor() {
        this.call = '';
    }

    ensureLoggedIn(o) {
        let options;
        if (typeof o === 'string') {
            options = { redirectTo: options };
        }
        options = options || {};

        const url = options.redirectTo || '/login';

        const setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;
        // eslint-disable-next-line consistent-return
        return function loggingIn(req, res, next) {
            log.info('request path', req.path);
            if (!req.isAuthenticated || !req.isAuthenticated()) {
                if (setReturnTo && req.session) {
                    req.session.returnTo = req.originalUrl || req.url;
                }
                return res.redirect(url);
            } 

            if (req.path.includes('/profile')) {
                log.info('the request is to profile', req.user);
                const profile = {
                    displayName: req.user.displayName,
                    id: req.user.id,
                    username: req.user.username
                  }
                return res.render('profile', {
                    profile: req.user,
                    displayName: req.user.displayName
                  });
            }
            if (!(req.user.restaurant || req.user.cinema)) {
                return res.redirect('/profile');
            }
            next();
        };
    }

    /**
  * Ensure that no user is logged in before proceeding to next route middleware.
  *
  * This middleware ensures that no user is logged in.  If a request is received
  * that is authenticated, the request will be redirected to another page (by
  * default to `/`).
  *
  * Options:
  *   - `redirectTo`   URL to redirect to in logged in, defaults to _/_
  *
  * Examples:
  *
  *     app.get('/login',
  *       ensureLoggedOut(),
  *       function(req, res) { ... });
  *
  *     app.get('/login',
  *       ensureLoggedOut('/home'),
  *       function(req, res) { ... });
  *
  *     app.get('/login',
  *       ensureLoggedOut({ redirectTo: '/home' }),
  *       function(req, res) { ... });
  *
  * @param {Object} options
  * @return {Function}
  * @api public
  */
    ensureLoggedOut(options) {
        let options;
        const call = this.call;
        if (typeof options === 'string') {
            options = { redirectTo: options };
        }
        options = options || {};

        const url = options.redirectTo || '/';

        return function (req, res, next) {
            if (req.isAuthenticated && req.isAuthenticated()) {
                return res.redirect(url);
            }
            next();
        };
    }
}

module.exports = { ensure: new Ensure() };
