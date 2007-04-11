/*La pantalla de ingreso de la aplicacion
Se borra la pasar 2 segundo*/

jQuery(document).ready(function(){
});


jQuery("#web2py_user_form input:visible:enabled:first").focus();

function popup(url) {
  newwindow=window.open(url,'name','height=400,width=600');
  if (window.focus) newwindow.focus();
  return false;
}

function collapse(id) { jQuery('#'+id).slideToggle(); }

function fade(id,value) { if(value>0) jQuery('#'+id).hide().fadeIn('slow'); else jQuery('#'+id).show().fadeOut('slow'); }

function ajax(u,s,t) {
    query = '';
    if (typeof s == "string") {
        d = jQuery(s).serialize();
        if(d){ query = d; }
    } else {
        pcs = [];
        for(i=0; i<s.length; i++) {
            q = jQuery("[name="+s[i]+"]").serialize();
            if(q){pcs.push(q);}
        }
        if (pcs.length>0){query = pcs.join("&");}
    }
    jQuery.ajax({type: "POST", url: u, data: query, success: function(msg) { if(t) { if(t==':eval') eval(msg); else jQuery("#" + t).html(msg); } } }); 
}

String.prototype.reverse = function () { return this.split('').reverse().join('');};
function web2py_ajax_init() {
  jQuery('.hidden').hide();
  jQuery('.error').hide().slideDown('slow');
  jQuery('.flash').click(function() { jQuery(this).fadeOut('slow'); return false; });
  // jQuery('input[type=submit]').click(function(){var t=jQuery(this);t.hide();t.after('<input class="submit_disabled" disabled="disabled" type="submit" name="'+t.attr("name")+'_dummy" value="'+t.val()+'">')});
  jQuery('input.integer').keyup(function(){this.value=this.value.reverse().replace(/[^0-9\-]|\-(?=.)/g,'').reverse();});
  jQuery('input.double,input.decimal').keyup(function(){this.value=this.value.reverse().replace(/[^0-9\-\.]|[\-](?=.)|[\.](?=[0-9]*[\.])/g,'').reverse();});
  jQuery("input[type='checkbox'].delete").each(function(){jQuery(this).click(function() { if(this.checked) if(!confirm("{{=T('Sure you want to delete this object?')}}")) this.checked=false; });});
  try {jQuery("input.date").focus( function() {Calendar.setup({
     inputField:this.id, ifFormat:"{{=T('%Y-%m-%d')}}", showsTime:false
  }); }); } catch(e) {};
  try { jQuery("input.datetime").focus( function() {Calendar.setup({
     inputField:this.id, ifFormat:"{{=T('%Y-%m-%d %H:%M:%S')}}", showsTime: true,timeFormat: "24"
  }); }); } catch(e) {};
  try { jQuery("input.time").clockpick({
      starthour:0, endhour:23, showminutes:true, military:true
  }); } catch(e) {};
};

jQuery(document).ready(function() {   
    var flash = jQuery('.flash');
    flash.hide();

    setTimeout(function(){
        $('#pagload2').addClass('hidden')
    },2000);

    if(flash.html()){ 
        setTimeout(function(){
            flash.slideDown('slow');
        },3000);
        setTimeout(function(){
            flash.hide('slow');
        },10000);
    }
    web2py_ajax_init();


    //tooltip
    $("[id^=icon_]").tooltip({
        track: true,
        delay: 0,
        showURL: false,
        fixPNG: true,
        showBody: " - ",
        extraClass: "fancy",
        top: 10,
        left: 5
    });
});

function web2py_trap_form(action,target) {
   jQuery('#'+target+' form').each(function(i){
      var form=jQuery(this);
      if(!form.hasClass('no_trap'))
        form.submit(function(obj){
         jQuery('.flash').hide().html('');
         web2py_ajax_page('post',action,form.serialize(),target);
         return false;
      });
   });
}

function web2py_ajax_page(method,action,data,target) {
  jQuery.ajax({'type':method,'url':action,'data':data,
    'beforeSend':function(xhr) {
      xhr.setRequestHeader('web2py-component-location',document.location);
      xhr.setRequestHeader('web2py-component-element',target);},
    'complete':function(xhr,text){
      var html=xhr.responseText;
      var content=xhr.getResponseHeader('web2py-component-content'); 
      var command=xhr.getResponseHeader('web2py-component-command');
      var flash=xhr.getResponseHeader('web2py-component-flash');
      var t = jQuery('#'+target);
      if(content=='prepend') t.prepend(html); 
      else if(content=='append') t.append(html);
      else if(content!='hide') t.html(html);  
      web2py_trap_form(action,target);
      web2py_ajax_init();      
      if(command) eval(command);
      if(flash) jQuery('.flash').html(flash).slideDown();
      }
    });
}

function web2py_component(action,target) {
    jQuery(document).ready(function(){ web2py_ajax_page('get',action,null,target); });
}

//Instancia de ui tab
$(function() {
    $( "#tabs" ).tabs({
        fx: { opacity: 'toggle' },
        collapsible: true,
        selected: null,
    }).find( ".ui-tabs-nav" ).sortable({ axis: "x" });
});
