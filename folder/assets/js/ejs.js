$('#check').change(function () {
    $('#btn').prop('disabled', !this.checked);
}).change()