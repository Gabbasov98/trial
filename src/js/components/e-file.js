;(function () {
    var REMOVE_ICON =
        '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="10" viewBox="0 0 8 10" fill="none">' +
        '<path opacity="0.9" d="M7.99805 9.99414H6.67871L3.97852 5.5918L1.2373 9.99414H0L3.3291 4.78516L0.232422 0H1.52441L4.01953 3.98535L6.52832 0H7.75879L4.66895 4.76465L7.99805 9.99414Z" fill="#2A3138"/></svg>';

    function initAttachBox(box) {
        var inputs = Array.prototype.slice.call(box.querySelectorAll('input[type="file"]'));
        var input  = inputs[0]; // через него выбирают файлы
        var list   = box.querySelector('.attach-box__previews');
        if (!input || !list) return;

        var MAX = inputs.length > 1 ? inputs.length : Infinity;
        input.multiple = true;

        var files = [];
        var urls  = [];

        function sync() {
            if (typeof DataTransfer === 'undefined') return;
            inputs.forEach(function (inp, i) {
                var dt = new DataTransfer();
                if (inputs.length === 1) files.forEach(function (f) { dt.items.add(f); });
                else if (files[i]) dt.items.add(files[i]);
                inp.files = dt.files;
            });
        }

        function render() {
            urls.forEach(URL.revokeObjectURL);
            urls = [];
            list.innerHTML = '';

            files.forEach(function (file, i) {
                var thumb = document.createElement('div');
                thumb.className = 'attach-thumb';
                thumb.title = file.name;

                if (/^image\//.test(file.type)) {
                    var url = URL.createObjectURL(file);
                    urls.push(url);
                    var img = document.createElement('img');
                    img.src = url;
                    img.alt = file.name;
                    thumb.appendChild(img);
                } else {
                    var ext = document.createElement('span');
                    ext.className = 'attach-thumb__ext';
                    ext.textContent = (file.name.split('.').pop() || 'file').slice(0, 4);
                    thumb.appendChild(ext);
                }

                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'attach-thumb__remove';
                btn.setAttribute('aria-label', 'Удалить ' + file.name);
                btn.innerHTML = REMOVE_ICON;
                btn.addEventListener('click', function () {
                    files.splice(i, 1);
                    sync();
                    // if (!files.length) input.value = '';
                    render();
                });

                thumb.appendChild(btn);
                list.appendChild(thumb);
            });
        }

        function reset() {
            files = [];
            inputs.forEach(function (inp) { inp.value = ''; });
            render();
        }

        input.addEventListener('change', function () {
            var picked = Array.prototype.slice.call(input.files);
            files = files.concat(picked).slice(0, MAX);
            sync();
            render();
        });

        // очистка после успешной отправки CF7 и при reset формы
        document.addEventListener('wpcf7mailsent', function (e) {
            if (e.target.contains(box)) reset();
        });
        var form = box.closest('form');
        if (form) form.addEventListener('reset', function () { setTimeout(reset); });
    }

    function initAll() {
        document.querySelectorAll('.attach-box').forEach(initAttachBox);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
    else initAll();
})();
