function menuHamburguerOpen() {
    const hamburguerButton = document.querySelector('#hamburguer_button');
    const menuOpen = document.querySelector('#main_menu');
    const hamburguerStick = document.querySelectorAll('.hamburguer_stick');
    const content_click_block = document.querySelector('#menu_click_block');
    hamburguerButton.classList.toggle('hamburguer_button_close');
    menuOpen.classList.toggle('hamburguer_open');
    content_click_block.classList.toggle('menu_click_block');
    hamburguerStick[0].classList.toggle('hamburguer_stick_close');
    hamburguerStick[1].classList.toggle('hamburguer_stick_close');
    hamburguerStick[2].classList.toggle('hamburguer_stick_close');
    document.body.classList.toggle('scroll_lock');
    topReturn();
}

function expandButtonAnimationOnClick() {
    const productSelection = document.querySelectorAll('.product_selection');
    for (let i = 0; i < productSelection.length; i++) {
        const expandButton = productSelection[i].querySelector('#expand_button');

        expandButton.addEventListener('click', function () {
            expandButtonStick = productSelection[i].querySelectorAll('.expand_stick');
            expandButtonStick[0].classList.toggle('close_expand_stick');

            productList = productSelection[i].querySelector('#product_list');
            productList.classList.toggle('product_list_close_animation');

            if (productList.classList.contains('product_list_close')) {
                productList.classList.toggle('product_list_close')
            } else {
                setTimeout(function () {
                    productList.classList.toggle('product_list_close');
                }, 500)
            }
        });
    }
}

function topReturn() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

function productCheck() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const finalizeOrderDiv = document.querySelector('#finalize_order');
    const productNumberDiv = document.querySelector('#product_number');
    let productNumber = 0;

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
            const isChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);

            if (isChecked) {
                finalizeOrderDiv.classList.remove('invisible');
                if (checkbox.checked) {
                    productNumber++;
                } else {
                    productNumber--;
                }
            } else {
                productNumber = 0;
                finalizeOrderDiv.classList.add('invisible');
            }
            productNumberDiv.innerText = productNumber;
        });
    });
}

function finalizeButtonPosition() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight

    if (scrollPosition + windowHeight >= documentHeight) {
        document.querySelector('#finalize_order').classList.add('finalize_order_footer_up');
    }
    else {
        document.querySelector('#finalize_order').classList.remove('finalize_order_footer_up');
    }
}

function calculateTotal(itens) {
    const totalValue = document.querySelector('#total_value')
    let total = 0;

    Array.from(itens).forEach((item) => {
        let item_value = item.querySelector('.item_value');
        let item_qtde = item.querySelector('#qtde').value;
        item_value = parseFloat(item_value.innerText.replace('R$', '').replace(',', '.'));
        if (!isNaN(item_value)) {
            total += item_value * (item_qtde * 1);
        }
    });
    totalValue.innerText = `Valor total: R$ ${total.toFixed(2)}`;
}

function resumeFinalize() {
    const blurEffect = document.getElementById("body_blur");
    const resumeOrder = document.getElementById("finalize_resume");
    const resumeOrderContent = document.getElementById("finalize_resume_content");
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');

    blurEffect.classList.remove('invisible');
    resumeOrder.classList.remove('invisible');
    document.body.classList.add('scroll_lock');
    topReturn();

    for (let i = 1; i <= checkboxes.length; i++) {
        const productDiv = checkboxes[i - 1].closest('.product');
        const nameItem = productDiv.querySelector('.name_product').textContent;
        const valueItem = productDiv.querySelector('.value_product').textContent;
        let divElement = document.createElement("div");

        divElement.classList.add('item_resume')
        divElement.innerHTML = '<p class="item_name"></p><p class="item_value"></p><div class="item_qtde"><button id="sub_button">-</button><input type="text" readonly value="1" id="qtde"><button id="add_button">+</button></div><button class="remove_item" id="remove_item"><img src="img/trash-can.png" alt="remove_item"></button>';
        divElement.querySelector(".item_name").textContent = nameItem;
        divElement.querySelector(".item_value").textContent = valueItem;

        resumeOrderContent.insertBefore(divElement, document.querySelector('#total_value'))
    }

    const itens_qtde = document.querySelectorAll('.item_qtde')
    let itens = resumeOrder.querySelectorAll('.item_resume')

    Array.from(itens_qtde).forEach(item => {
        const subButton = item.querySelector('#sub_button');
        const addButton = item.querySelector('#add_button');
        let item_qtde = item.querySelector('#qtde');

        subButton.setAttribute('disabled', '');
        subButton.addEventListener('click', () => {
            item_qtde.value = (item_qtde.value * 1) - 1
            if (item_qtde.value <= 1) {
                subButton.setAttribute('disabled', '');
                item_qtde.value = 1;
            }
            calculateTotal(itens);
        })

        addButton.addEventListener('click', () => {
            subButton.removeAttribute('disabled', '')
            item_qtde.value = (item_qtde.value * 1) + 1
            calculateTotal(itens);
        })
    });

    Array.from(itens).forEach(item => {
        const deleteItemButton = item.querySelector('#remove_item')

        deleteItemButton.addEventListener('click', () => {
            item.remove();
            itens = resumeOrder.querySelectorAll('.item_resume');
            calculateTotal(itens);

            if (itens.length == 0) {
                let divElement = document.createElement("div");
                divElement.classList.add('no_item');
                divElement.innerHTML = '<p class="item_empty">Sem itens no seu Pedido</p>';
                resumeOrderContent.insertBefore(divElement, document.querySelector('#total_value'));
            }
        })
    });

    calculateTotal(itens);

    const radioButtons = document.querySelectorAll('.radio_method');

    Array.from(radioButtons).forEach(radioButton => {
        radioButton.addEventListener('click', () => {
            Array.from(radioButtons).forEach(btn => {
                btn.checked = false;
            });
            radioButton.checked = true;
        });
    });

    const deliveryOptionRadios = document.querySelectorAll('.radio_delivery');
    const addressInputs = document.querySelectorAll('.address_input');

    for (let i = 0; i < deliveryOptionRadios.length; i++) {
        deliveryOptionRadios[i].addEventListener('click', () => {
            Array.from(deliveryOptionRadios).forEach(btn => {
                btn.checked = false;
            });
            deliveryOptionRadios[i].checked = true;
            if (deliveryOptionRadios[1].checked == true) {
                Array.from(addressInputs).forEach(addressInput => {
                    addressInput.setAttribute('disabled', '')
                })
            }
            else {
                Array.from(addressInputs).forEach(addressInput => {
                    addressInput.removeAttribute('disabled', '')
                })
            }
        })
    }
}

function closeResume() {
    const blurEffect = document.getElementById("body_blur");
    const resumeOrder = document.getElementById("finalize_resume");
    blurEffect.classList.add('invisible');
    resumeOrder.classList.add('invisible');
    document.body.classList.remove('scroll_lock');
    itens = resumeOrder.querySelectorAll('.item_resume');
    if (itens.length >= 1) {
        Array.from(itens).forEach(item => {
            item.remove();
        });
    }
    else {
        document.querySelector('.no_item').remove();
    }

    userNameValidation();
    userTelValidation();
    zipCodeValidation();
    numberAddressValidation();
}

function userNameValidation() {
    let userName = document.querySelector('#name_input');
    userName.value = userName.value.replace(/\d/g, '')
    if(userName.classList.contains('required_field')){
        userName.classList.remove('required_field')
    }
}

function userTelValidation() {
    const alert = document.querySelector('.alert_finalize');
    let tel = document.querySelector('#tel_input');

    tel.value = tel.value.replace(/\D/g, '')
    tel.value = tel.value.replace(/(\d{2})(\d)/, "($1) $2")
    tel.value = tel.value.replace(/(\d{5})(\d)/, "$1-$2")
    if(tel.classList.contains('required_field')){
        tel.classList.remove('required_field')
    }
    
    document.querySelector('#tel_input').addEventListener('focusout', () => {
        if(!(document.activeElement === tel) && (tel.value.length < 15)){
            alert.textContent = "Insira um telefone celular valido"
            alert.classList.add('alert_finalize_show');
            setTimeout(() => {
                alert.classList.remove('alert_finalize_show');
            }, 2000);
        }
    })
    document.querySelector('#tel_input').addEventListener('touchend', () => {
        if(!(document.activeElement === tel) && (tel.value.length < 15)){
            alert.textContent = "Insira um telefone celular valido"
            alert.classList.add('alert_finalize_show');
            setTimeout(() => {
                alert.classList.remove('alert_finalize_show');
            }, 2000);
        }
    })
}

async function zipSearch() {
    const cep = document.querySelector('#cep').value;

    if (cep.length === 0) {
        clearAddress();
    }
    else {
        if (cep.length === 9) {
            const url = `https://viacep.com.br/ws/${cep}/json`;
            const dados = await fetch(url);
            const address = await dados.json();
            if (address.hasOwnProperty('erro')) {
                clearAddress();
                document.querySelector('#logradouro').value = 'CEP não encontrado';
            }
            else {
                fillAddress(address)
            }
        }
        else {
            clearAddress();
            document.querySelector('#logradouro').value = 'CEP não valido';
        }
    }
}

function fillAddress(address) {
    document.querySelector('#logradouro').value = address.logradouro;
    document.querySelector('#estado').value = address.uf;
    document.querySelector('#bairro').value = address.bairro;
    document.querySelector('#cidade').value = address.localidade;
}

function clearAddress() {
    document.querySelector('#numero').value = '';
    document.querySelector('#logradouro').value = '';
    document.querySelector('#estado').value = '';
    document.querySelector('#bairro').value = '';
    document.querySelector('#cidade').value = '';
}

function zipCodeValidation() {
    let cep = document.querySelector('#cep');

    cep.value = cep.value.replace(/\D/g, '')
    cep.value = cep.value.replace(/(\d{5})(\d)/, '$1-$2')
    cep.classList.remove('required_field');
}

function numberAddressValidation(){
    let numero = document.querySelector('#numero');

    numero.value = numero.value.replace(/\D/g, '');
    numero.value = numero.value.replace(/(\d{5})(\d)/, '$1-$2');
    numero.classList.remove('required_field');
}

function finalizeOrder() {
    const alert = document.querySelector('.alert_finalize');
    const products = document.querySelectorAll('.item_resume');
    const payMethod = document.querySelector('.radio_method:checked').closest('.method').textContent;
    const userName = document.querySelector('#name_input');
    const userTel = document.querySelector('#tel_input');
    const deliveryMethod = document.querySelector('.radio_delivery:checked')
    const cep = document.querySelector('#cep');
    const logradouro = document.querySelector('#logradouro');
    const numero = document.querySelector('#numero');
    const bairro = document.querySelector('#bairro');
    const cidade = document.querySelector('#cidade');
    let messageOrder = '';

    if (products.length < 1) {
        alert.textContent = "Não há produtos no pedido!"
        alert.classList.add('alert_finalize_show');
        setTimeout(() => {
            alert.classList.remove('alert_finalize_show');
        }, 2000);
    }
    else if(userName.value === '' || userTel.value === '' || userTel.value.length < 15){
        alert.textContent = "Por favor preencha suas informações corretamente!"
        alert.classList.add('alert_finalize_show');
        setTimeout(() => {
            alert.classList.remove('alert_finalize_show');
        }, 2000);

        if(userName.value === ''){
            userName.classList.add('required_field');
        }
        else{
            userName.classList.remove('required_field');
        }

        if(userTel.value === ''){
            userTel.classList.add('required_field');
        }
        else{
            userTel.classList.remove('required_field');
        }
    }
    else if(cep.value === '' || numero.value === '' || logradouro.value === 'CEP não valido'){
        alert.textContent = "Por favor preencha seu endereço corretamente!"
        alert.classList.add('alert_finalize_show');
        setTimeout(() => {
            alert.classList.remove('alert_finalize_show');
        }, 2000);

        if(cep.value === ''){
            cep.classList.add('required_field');
        }
        else{
            cep.classList.remove('required_field');
        }

        if(numero.value === ''){
            numero.classList.add('required_field');
        }
        else{
            numero.classList.remove('required_field');
        }
    }
    else {
        messageOrder = `Olá me chamo ${userName.value} e gostaria de fazer o seguinte pedido: \n`

        products.forEach(product => {
            const product_name = product.querySelector('.item_name').textContent.replace(':', '');
            const product_qtde = product.querySelector('.item_qtde').querySelector('#qtde').value * 1;

            messageOrder += `${product_qtde}x ${product_name} \n`;
        })
        
        const total_order_value = document.querySelector('#total_value').textContent;

        messageOrder += `${total_order_value} \nMetodo de pagamento: ${payMethod.trim()} \n` ;

        if (deliveryMethod.id === 'entrega') {
            messageOrder += `Para o seguinte endereço: \n${logradouro.value} ${numero.value} \n${bairro.value} ${cidade.value} \n${cep.value}`;
        }
        else {
            messageOrder += 'Retirada no Local';
        }

        window.open(`https://api.whatsapp.com/send?phone=5519971042734&text=${encodeURI(messageOrder)}&app_absent=1`, '_blank').focus()
    }
}

document.addEventListener('DOMContentLoaded', expandButtonAnimationOnClick);
document.addEventListener('DOMContentLoaded', productCheck);
document.querySelector('#hamburguer_button').addEventListener('click', menuHamburguerOpen);
document.querySelector('#menu_click_block').addEventListener('click', menuHamburguerOpen);
document.querySelector('#button_top_return').addEventListener('click', topReturn);
document.querySelector('#order_button').addEventListener('click', resumeFinalize);
document.querySelector('#close_button').addEventListener('click', closeResume);
document.querySelector('#finalize_button').addEventListener('click', finalizeOrder);
document.querySelector('#name_input').addEventListener('input', userNameValidation)
document.querySelector('#tel_input').addEventListener('input', userTelValidation)
document.querySelector('#cep').addEventListener('focusout', zipSearch);
document.querySelector('#cep').addEventListener('touchend', zipSearch);
document.querySelector('#cep').addEventListener('input', zipCodeValidation);
document.querySelector('#numero').addEventListener('input', numberAddressValidation);
window.addEventListener('scroll', finalizeButtonPosition);