app.value('toastr', toastr);

app.factory('notifier', function(toastr) {
    return {
        notifySuccess: function(msg) {
            toastr.success(msg);
        },
        notifyError: function(msg) {
            toastr.error(msg);
        }
    }
});