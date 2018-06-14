$(document).ready(function() {
    $('.tenpai').hide();
    const defaultGameStat = {
        dealer: null,
        winner: null,
        discarder: null,
        child: null,
        noWin: false,
        scores: [null, null, null, null]
    };
    $('#game-table').data('games', [[defaultGameStat, [25000, 25000, 25000, 25000]]]);
    $('#game-results').data('gameStat', defaultGameStat);
    gameHistory.genGameHistoryTable();
});

window.onbeforeunload = function() {
    return "The game history will be lost, are you sure?";
};