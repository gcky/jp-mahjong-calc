function calcPoints () {
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
    console.log(fan)
    if (fan < 5) {
        console.log(fu)
        basicPoints = fu*Math.pow(2, fan+2)
        console.log(basicPoints)
        $('#basic-points').html(basicPoints);
    }
}