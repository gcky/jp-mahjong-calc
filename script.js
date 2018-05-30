function calcPoints() {
    console.log("lol")
    let fu = 20;
    if ($('#single-call').prop('checked')) {
        fu += 2;
    }
    if ($('#door-ching').prop('checked') && 
        !$('#lon-self').prop('checked')) {
        fu += 10;
    }
    if ($('#lon-self').prop('checked') && 
        !$('#ping-flower').prop('checked')) {
        fu += 2;
    }
    if ($('#own-wind-eye').prop('checked')) {
        fu += 2;
    }
    if ($('#board-wind-eye').prop('checked')) {
        fu += 2;
    }
    if ($('#three-dollar-eye').prop('checked')) {
        fu += 2;
    }
    fu += 2*$('#minghak28').val();
    fu += 4*$('#minghak19').val();
    fu += 4*$('#amhak28').val();
    fu += 8*$('#amhak19').val();
    fu += 8*$('#minggong28').val();
    fu += 16*$('#minggong19').val();
    fu += 16*$('#amgong28').val();
    fu += 32*$('#amgong19').val();
    fu = Math.ceil(fu/10)*10;
    const fan = Number($('#fan').val());
    let basicPoints = 0;
    let winnerScore = 0;
    let jongScore = null;
    let haanScore = null;
    let chutchungScore = null;
    if (fan < 5) {
        basicPoints = fu*Math.pow(2, fan+2)
    }
    if ($('input[name=winner]:checked').val() == 'jong') {
        if ($('#lon-self').prop('checked')) {
            haanScore = -2*basicPoints;
            winnerScore = 6*basicPoints;
        } else {
            chutchungScore = -6*basicPoints;
            winnerScore = 6*basicPoints;
        }
    } else {
        if ($('#lon-self').prop('checked')) {
            jongScore = -2*basicPoints;
            haanScore = -basicPoints;
            winnerScore = 4*basicPoints;
        } else {
            chutchungScore = -4*basicPoints;
            winnerScore = 4*basicPoints;
        }
    }
    displayGameResults(winnerScore, jongScore, haanScore, chutchungScore);
}

function displayGameResults(winner, jong, haan, chutchong) {
    $('#winner-score').html('+'+winner);
    $('#chutchung-score').html(chutchong);
    $('#jong-score').html(jong);
    $('#haan-score').html(haan);
}

function reset() {
    $('input:checkbox').prop('checked', false);
}