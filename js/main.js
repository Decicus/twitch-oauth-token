var scopes = {
    "user_read": "Read access to non-public user information, such as email address.",
    "user_blocks_edit": "Ability to ignore or unignore on behalf of a user.",
    "user_blocks_read": "Read access to a user's list of ignored users.",
    "user_follows_edit": "Access to manage a user's followed channels.",
    "channel_read": "Read access to non-public channel information, including email address and stream key.",
    "channel_editor": "Write access to channel metadata (game, status, etc).",
    "channel_commercial": "Access to trigger commercials on channel.",
    "channel_stream": "Ability to reset a channel's stream key.",
    "channel_subscriptions": "Read access to all subscribers to your channel.",
    "user_subscriptions": "Read access to subscriptions of a user.",
    "channel_check_subscription": "Read access to check if a user is subscribed to your channel.",
    "chat_login": "Ability to log into chat and send messages.",
    "channel_feed_read": "Ability to view to a channel feed.",
    "channel_feed_edit": "Ability to add posts and reactions to a channel feed.",
    "collections_edit": "Manage a user’s collections (of videos).",
    "communities_edit": "Manage a user’s communities.",
    "communities_moderate": "Manage community moderators.",
    "viewing_activity_read": "Turn on Viewer Heartbeat Service ability to record user data.",
    "openid": "Use OpenID Connect authentication.",

    /**
     * Helix scopes
     */
    "analytics:read:extensions": "View analytics data for your extensions.",
    "analytics:read:games": "View analytics data for your games.",
    "bits:read": "View Bits information for your channel.",
    "clips:edit": "Manage a clip object.",
    "user:edit": "Manage a user object.",
    "user:edit:broadcast": "Edit your channel’s broadcast configuration, including extension configuration. (This scope implies user:read:broadcast capability.)",
    "user:read:broadcast": "View your broadcasting configuration, including extension configurations.",
    "user:read:email": "Read authorized user’s email address.",
};

$(document).ready(function() {
    var container = $('#scopes'),
        connect = $('.connect'),
        token = $('.token'),
        hash = window.location.hash.replace('#', '');

    container.attr('size', Object.keys(scopes).length);
    var split = hash.split("+");
    $.each(scopes, function(scope, description) {
        $('<option/>')
            .attr('id', scope)
            .html(scope + ' &mdash; ' + description)
            .appendTo(container);

        if (split.indexOf(scope) >= 0) {
            $('#' + scope, container).attr('selected', "selected");
        }
    });

    Twitch.init({clientId: client_id}, function(err, stat) {
        if (stat.authenticated) {
            var authToken = Twitch.getToken();
            connect.hide();
            $('.well', token).html(authToken);
            $.each(stat.scope, function(key, scope) {
                $('#list', token).append(
                    $('<li/>')
                        .addClass('list-group-item')
                        .html(scope + ' &mdash; ' + scopes[scope])
                );
            });
            token.show();
        }
    });

    $('.connect a').on('click', function() {
        var auth = [];
        $(':checked', container).each(function() {
            var scope = $(this).attr('id');
            auth.push(scope);
        });

        Twitch.login({
            scope: auth,
            force_verify: true
        });
    });

    $('.logout').on('click', function() {
        Twitch.logout();
        connect.show();
        token.hide();
    });
});
