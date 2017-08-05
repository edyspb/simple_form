var MyForm = {

    validateFio: function (fio) {
        var regexp = /^\s*[A-Za-zА-Яа-я-]+\s+[A-Za-zА-Яа-я-]+\s+[A-Za-zА-Яа-я-]+\s*$/;
        return fio.search(regexp) != -1;
    },

    validateEmail: function (email) {
        var regexp = /\S+@(\S+\.\S+)/;
        var validDomains = [
            "ya.ru",
            "yandex.ru",
            "yandex.ua",
            "yandex.by",
            "yandex.kz",
            "yandex.com"
        ];
        var m = email.match(regexp);
        return m != null && validDomains.indexOf(m[1]) != -1;
    },

    validatePhone: function (phone) {
        var regexp = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        var validFormat = phone.search(regexp) != -1;
        if (validFormat) {
            var digSum = phone.match(/\d/g).reduce(
                (acc, val, i, arr) => { 
                    return acc + Number(val)
                },
                initialValue = 0
            );
            return digSum <= 30;
        }
        return false;
    },

    validate: function () {
        var errorFields = [];
        var data = this.getData();

        if (!this.validateFio(data.fio)) {
            errorFields.push('fio');
        }
        if (!this.validateEmail(data.email)) {
            errorFields.push('email');
        }
        if (!this.validatePhone(data.phone)) {
            errorFields.push('phone');
        }
        return {
            isValid: errorFields.length == 0,
            errorFields: errorFields
        };
    },

    getData: function () {
        return { 
            fio: $("input[name='fio']").val(),
            email: $("input[name='email']").val(),
            phone: $("input[name='phone']").val()
        };
    },

    setData: function (data) {
        $("input[name='fio']").val(data.fio);
        $("input[name='email']").val(data.email);
        $("input[name='phone']").val(data.phone);
    },

    sendRequest: function (url, data, type) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            success: function (response) {
                var resultContainer = $("#resultContainer");
                if (resultContainer.hasClass("progress")) {
                    resultContainer.removeClass("progress");
                }
                resultContainer.addClass(response.status);
                if (response.status == "success") {
                    resultContainer.html("Success");
                } else if (response.status == "error") {
                    resultContainer.html(response.reason);
                } else if (response.status == "progress") {
                    setTimeout(() => { MyForm.sendRequest(url, data, type); }, response.timeout);
                }
            },
            error: function (response) {
                console.log('An error occurred.');
            },
        });
    },

    submit: function () {
        $("input").removeClass("error");
        var result = this.validate();
        if (result.isValid) {
            $("#submitButton").prop("disabled", true);
            var form = $("#myForm");
            this.sendRequest(form.attr("action"), form.serialize(), form.attr("method"));
        } else {
            for (var i = 0; i < result.errorFields.length; i++) {
                var errorField = result.errorFields[i];
                $("input[name='" + errorField + "']").addClass("error");
            }
        }
    }
};

$('#myForm').submit(function (e) {
    e.preventDefault();
    MyForm.submit();
});
