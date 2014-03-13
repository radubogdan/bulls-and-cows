(function () {

    function menu_nav(evt) {
        $("#back").show();
        $("#mode_selector").hide();
        $("#footer").hide();

        var go = evt.target.id;

        switch(go) {
            case 'go_game':
                $("#mastermind-game").show();
                break;

            case 'go_highscores':
                $("#highscores").show();
                scores();
                break;

            case 'go_settings':
                $("#settings").show();
                break;

            case 'go_about':
                $("#about").show();
                break;

            case 'back':
                $("#back").hide();
                $("#mastermind-game").hide();
                $("#settings").hide();
                $("#highscores").hide();
                $("#about").hide();
                $("#mode_selector").show();
                $("#footer").show();
                break;
        } 
    }

    $("#go_game").on("click", menu_nav); 
    $("#go_settings").on("click", menu_nav);
    $("#go_highscores").on("click", menu_nav); 
    $("#go_about").on("click", menu_nav); 
    $("#back").on("click", menu_nav);

    var clear = function(){
        $('#req').val('');
        $('.digit').removeAttr("disabled");
        $('.clear').removeAttr("disabled");
        $('.reset').removeAttr("disabled");
        $('.zero').attr("disabled", "disabled"); 
    };

    var reset = function(){
        clear();

        $('.zero').attr("disabled", "disabled"); 
        $('.gueses').empty();
    };

    var start = function(){
        reset();
        var mastermindApi = 'http://dotix.usr.sh/api/games/new';
        $.getJSON(mastermindApi, function(data) {
            $('#game_token').val(data.mastermind.game_token);
        });
    };

    var scores = function() {
        var mastermindApi = 'http://dotix.usr.sh/api/games/show';
        var scores_container = $('.scores');

        $.getJSON(mastermindApi, function(data) {
            var username = '';
            var dude = '';
            
            $.each(data, function(i, score){
                score.game.name === '' ? username = 'Anonymous' : username = score.game.name;
                dude += '<li>' + " " + username + " " + score.game.tries +'</li>';
            });
            
            scores_container.empty();
            scores_container.append(dude);
        });
    };

    $("#refresh_highscore").on('click', scores);

    $(".clear").on("click", function(){ clear(); });
    $('.reset').on("click", function(){ reset(); });
    $(".start").on("click", function(){ start(); });

    $(".digit").on("click", function() { 
        var digit = $(this);
        var req = $('#req');

        $('.zero').removeAttr("disabled"); 

        if (req.val().length < 4) {
            req.val(req.val() + digit.val());
            digit.attr("disabled", "disabled");
        } else { 
            return false; 
        }
    });

    $("#send").on("click", function() {
        var mastermindApi = 'http://dotix.usr.sh/api/games/';
        var guess = $('#req').val();
        var token = $('#game_token').val();
        var player_name = $('#player_name').val();

        if (guess.length === 4) {
            $.post(mastermindApi, { guess : guess, game_token : token, name : player_name }).done(function(data) {
                var format_result = guess + " " + data.mastermind.bulls + " " + data.mastermind.cows;

                $('.gueses').append("<li>" + format_result + "</li>");

                if (data.mastermind.bulls === 4) {
                    $('.gueses').append("<li>" + "Congratulations! You have guessed the number in " + data.mastermind.tries + " tries"  + "</li>");
                }

                clear();
            });
        }
        return false;
    });
})();

(function(){
    function install(evt) {
        evt.preventDefault();
        var manifestUrl = 'http://dotix.usr.sh/bulls/manifest.webapp';
        var req = navigator.mozApps.installPackage(manifestUrl);

        req.onsuccess = function() {
            alert(this.result.origin);
        };

        req.onerror = function() {
            alert(this.error.name);
        };
    }

    $('#install').on('click', install);
})();
