// Put your application javascript here
$(document).ready(function() {
     let
        onQuantityBtnClick = function(e) {
                //$ represents an element not a value
                let 
                  $button = $(this),
                  $form= $button.closest('form'),
                  $quantity= $form.find('.js-quantity-field'),
                  quantityValue = parseInt($quantity.val()),
                  max = $quantity.attr('max') ? parseInt($quantity.attr('max')) : null; 
              
                  if ($button.hasClass('plus') && (max === null || quantityValue+ 1 <= max)) {
                      // do something for plus click 
                     $quantity.val(quantityValue + 1).change();
                     
                  } 
                  else if ($button.hasClass('minus')) {
                     // do something for minus click 
                     $quantity.val(quantityValue - 1).change();
            }
       },
          onQuantityFieldChange = function(e) {
            let 
               $field = $(this),
               $form = $field.closest('form'),
               $quantityText = $form.find('.js-quantity-text'),
               shouldDisableMinus = parseInt(this.value) === 1,
               shouldDisablePlus = parseInt(this.value) === parseInt($field.attr('max')),
               $minusButton = $form.find('.js-quantity-btn.minus'),
               $plusButton = $form.find('.js-quantity-btn.plus');
               
    
               $quantityText.text(this.value);
    
               if (shouldDisableMinus) {
                   $minusButton.prop('disabled', true);
               }
               else if ($minusButton.prop('disabled') === true) {
                $minusButton.prop('disabled', false);
               }
    
               if (shouldDisablePlus) {
                $plusButton.prop('disabled', true);
            }
            else if ($plusButton.prop('disabled') === true) {
             $plusButton.prop('disabled', false);
            }
        },
        onVariantRadioChange = function(e) {
                let
                    $radio = $(this),
                    $form = $radio.closest('form'),
                    max = $radio.attr('data-inventory-quantity'),
                    $quantity = $form.find('.js-quantity-field'),
                    $addToCartBtn = $form.find('#add-to-cart-btn');
        
                   if ($addToCartBtn.prop('disabled') === true) {
                        $addToCartBtn.prop('disabled', false); //setting the property to false 
                       }
                  
              $quantity.attr('max', max);

              if(parseInt($quantity.val()) > max) {
                  $quantity.val(max).change();
              }
            },
            onCartUpdated = function() {
              $.ajax({
                type: 'GET',
                url: '/cart',
                context: document.body,
                success: function(context) {
                  let
                    $dataCartContents = $(context).find('.js-cart-page-contents'),
                    dataCartHtml = $dataCartContents.html(),
                    dataCartItemCount = $dataCartContents.attr('data-cart-item-count'),
                    $miniCartContents = $('.js-mini-cart-contents'),
                    $cartItemCount = $('.js-cart-item-count');
        
                  $cartItemCount.text(dataCartItemCount);
                  $miniCartContents.html(dataCartHtml);

                  if(parseInt(dataCartItemCount) > 0) {
                    openCart();
                  } else {
                    closeCart();
                  }
        
                }
              });
            },
            onError = function(XMLHttpRequest, textStatus) {
              let data = XMLHttpRequest.responseJSON;
              alert(data.status + ' - ' + data.message + ': ' + data.description);
            },
            onAddToCart = function(e) {
              //override the default behavior of the addtocart btn
              e.preventDefault();
                
              let addToCartForm = document.querySelector('form[action="/cart/add"]');
              let formData = new FormData(addToCartForm);

                fetch('/cart/add.js', {
                  method: 'POST',
                  body: formData
                })
                .then(response => {
                  onCartUpdated();
                  return response.json();
                })
                .catch((error) => {
                  onError();
                  console.error('Error:', error);
                })
            },
            onLineRemoved = function(e) {
              e.preventDefault();

              let 
                $removeLink = $(this),
                removeQuery = $removeLink.attr('href').split('change?')[1];
              $.post('/cart/change.js', removeQuery, onCartUpdated, 'json');
          
           },
            openCart = function() {
              $('html').addClass('mini-cart-open');
            },
            closeCart = function() {
              $('html').removeClass('mini-cart-open');
            },
            onCartBtnClick = function(e) {
              e.preventDefault();
               
              let isCartOpen = $('html').hasClass('mini-cart-open');

              if(!isCartOpen) {
                openCart();
              } else {
                closeCart();
              }

            };
          
            $(document).on('click', '.js-quantity-btn', onQuantityBtnClick);
            $(document).on('change', '.js-quantity-field', onQuantityFieldChange );
            $(document).on('change', '.js-variant-radio', onVariantRadioChange );
            $(document).on('submit', '#add-to-cart-form', onAddToCart);
            $(document).on('click', '#mini-cart .js-remove-line', onLineRemoved);
            $(document).on('click','.js-cart-link, #mini-cart .js-keep-shopping', onCartBtnClick);
    });

    
       
