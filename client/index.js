$(function() {
    $('.btn.submit').click(function(){
        formData = $("form")[0]
        $.ajax({
            type: 'POST',
            url: 'http://localhost:1323',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                name: formData.inputName.value,
                cpf: formData.inputCPF.value,
                address: {
                    street: formData.inputAddress.value,
                    number: parseInt(formData.inputNumber.value),
                    city: formData.inputCity.value,
                    state: formData.inputState.value
                }
            }),
            success: function (data) {
                table = $('#client-table tbody');
                appendToTable(table, [data])
                $('.modal.fade.centered-modal').modal('toggle')
            }
        });
    })  
})

$(function() {
    $("#btn-search").click(function() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:1323',
            dataType: 'json',
            contentType: 'application/json',
            data: {
                name: $("#input-search")[0].value
            },
            success: function (data) {
                table = $('#client-table tbody');
                table.empty()
                appendToTable(table, data)
            }
        });
    })
})

function appendToTable(table, data){
    data.forEach(function (item) {
        table.append(
            `<tr>
            <td>${item.name}</td>
            <td>${item.cpf}</td>
            <td>${item.address.street}, ${item.address.number}, ${item.address.city}, ${item.address.state}</td>
            <td><button type="button" class="btn btn-outline-danger" onclick="deleteClient(this)"><svg class="del-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-octagon-fill" viewBox="0 0 16 16">
            <path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353L11.46.146zm-6.106 4.5L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/>
          </svg> Deletar</button>
            </td>
          </tr>`)
    })
}

function deleteClient(elem) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:1323/${elem.parentNode.parentNode.children[0].innerText}`,
        success: function (data) {
            $('#btn-search').trigger("click");
        }
    })
}