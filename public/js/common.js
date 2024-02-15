$(document).ready(function () {
    $('.datepicker').datepicker({
        autoclose: true
    });

    $(document).on('click', '.view-employee', function (e) {
        e.preventDefault();
        var employee_id = $(this).attr('data-employee-id');
        $.ajax({
            url: "/employee/view",
            type: 'POST',
            dataType: 'JSON',
            data: {employee_id: employee_id},
            success: function (response) {
                if (response.status == 1) {
                    $modal = $('#employee_detail');

                    $modal.find('.employee-name').text(response.data[0].name);
                    $modal.find('.employee-email').text(response.data[0].email);
                    $modal.find('.employee-company').text(response.data[0].company_name);
                    $modal.find('.employee-dob').text(response.data[0].joining_date);
                    $modal.find('.employee-doj').text(response.data[0].date_of_birth);
                    $modal.find('.employee-dol').text(response.data[0].leaving_date);
                    $modal.modal('show');
                } else {
                    alert(response.message);
                }
            }
        });
    });

    $(document).on('click', '.view-item', function (e) {
        e.preventDefault();
        var id = $(this).attr('data-id');
        // alert(id);
        $.ajax({
            url: "/customers/view",
            type: 'POST',
            dataType: 'JSON',
            data: {id: id},
            success: function (response) {

                console.log("response.status",response.status);

                console.log(response);
                if (response.status == 1) {
                    $modal = $('#item_detail');
                    $modal.find('.item-name').text(response.data.name);
                    $modal.find('.item-email').text(response.data.email);
                    $modal.find('.item-surname').text(response.data.surname);
                    $modal.find('.item-age').text(response.data.age);
                    $modal.find('.item-description').text(response.data.description);
                    $modal.modal('show');
                } else {
                    alert("issue "+response.message);
                }
            }
        });
    });

    $(document).on('hide.bs.modal', '#employee_detail', function () {
        $modal = $('#employee_detail');
        $modal.find('.employee-name').text('');
        $modal.find('.employee-email').text('');
        $modal.find('.employee-company').text('');
        $modal.find('.employee-dob').text('');
        $modal.find('.employee-doj').text('');
        $modal.find('.employee-dol').text('');
    });
});