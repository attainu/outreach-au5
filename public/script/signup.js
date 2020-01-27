

    $(document).ready(()=>{
        $("#navigation-bar").load("/navigation_bar/nav_guest/nav_guest.hbs");
        let form = document.querySelector('form');

        form.onsubmit = sendData;
        
        function sendData(e){
            e.preventDefault();

            let formData = new FormData(form);

            let Params = {
                headers:{
                    'Content-type':'application/x-www-form-urlencoded'
                },
                body: JSON.stringify({
                    username:formData.get('username'),
                    firstname : formData.get('firstname'),
                    lastname : formData.get('lastname'),
                    password: formData.get('password'),
                    city: formData.get('city'),
                    gender: formData.get('gender')
                }),
                method: "POST"
            }

            fetch('/register',Params)
            .then(response=>response.json())
            .then(data=>{   
                console.log(data)
                if(data.msg[0]=="R"){
                    $('#successModal').modal('show');
                }
                else{
                    showError("email",data.msg);
                }
            })
        }

        var elementStates = [false,false,false,false,false,false] //name,email,password,cpassword,city,gender
        $('#firstName').on('input',()=>{
            if(!/([^\s])/.test($("#firstName").val())){
                $("#firstName").addClass("error-border");
                showError("firstname"," *First name cannot be empty");
                elementStates[0]=false;
                submitReadyState();
            }
            else{
                $("#firstName").removeClass("error-border");
                $(".firstname-error").empty();
                $(".firstname-error").removeClass("show-error");
                elementStates[0]=true;
                submitReadyState();
            }
        })

        $('#lastName').on('input',()=>{
            if(!/([^\s])/.test($("#lastName").val())){
                $("#lastName").addClass("error-border");
                showError("lastname"," *Last name cannot be empty");
                elementStates[0]=false;
                submitReadyState();
            }
            else{
                $("#lastName").removeClass("error-border");
                $(".lastname-error").empty();
                $(".lastname-error").removeClass("show-error");
                elementStates[0]=true;
                submitReadyState();
            }
        })

        $("#email").on('input',()=>{
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test($('#email').val().toLowerCase())){
                $("#email").addClass("error-border");
                showError("email","*Please enter a valid email address");
                elementStates[1]=false;
                submitReadyState();
            }
            else{
                $("#email").removeClass("error-border");
                $(".email-error").empty();
                $(".email-error").removeClass("show-error");
                elementStates[1]=true;
                submitReadyState();
            }
        })

        $('#passWord').on('input',()=>{
            if($('#passWord').val().length < 8){
                $("#passWord").addClass("error-border");
                showError("password","*Password must be atleast 8 characters long");
                elementStates[2]=false;
                submitReadyState();
            }
            else{
                $("#passWord").removeClass("error-border");
                $(".password-error").empty();
                $(".password-error").removeClass("show-error");
                elementStates[2]=true;
                submitReadyState();
            }
        })

        $("#ConfirmPassWord").on('input',()=>{
            if($('#passWord').val()!=$('#ConfirmPassWord').val()){
                $("#ConfirmPassWord").addClass("error-border");
                showError("Cpassword","*Password and Confirm password didnot match");
                elementStates[3]=false;
                submitReadyState();
            }
            else{
                $("#ConfirmPassWord").removeClass("error-border");
                $(".Cpassword-error").empty();
                $(".Cpassword-error").removeClass("show-error");
                elementStates[3]=true;
                submitReadyState();
            }
        })

        $(".formCity").on('input',()=>{
            elementStates[4] = true
            console.log(elementStates)
        })

        $(".formGender").on('input',()=>{
            elementStates[5] = true
            console.log(elementStates)
        })

        function submitReadyState(){
            console.log(elementStates)
            if(elementStates[0]==true&&elementStates[1]==true&&elementStates[2]==true&&elementStates[3]==true&&elementStates[4]==true&&elementStates[5]==true){
                $(".buuup").attr("disabled",false);
            }else{
                $(".buuup").attr("disabled",true);
            }
        }
        
        function showError(check,msg){
            $("."+check+"-error").html(msg)
            $("."+check+"-error").addClass("show-error")
        }
    })