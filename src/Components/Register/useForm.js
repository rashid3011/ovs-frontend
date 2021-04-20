import {useState} from 'react'

function useForm(){
    const [value, setValue] = useState({
        id : "",
        password : "",
    })

    const [error, setError] = useState({
        idError : false,
        passwordError : false,
    })

    const changeHandler = (event) =>{
        setValue({
            ...value,
            [event.target.name] : event.target.value
        })
    }

    const submitHandler = (event) => {
        event.preventDefault()
        const {id, password} = value
        if(!id.trim() && !password.trim()){
            setError({
                idError: true,
                passwordError:true,
            })
        }
        else if(!id.trim()){
            setError({
                idError:true,
                passwordError:false,
            })
        }
        else if(!password.trim()){
            setError({
                idError : false,
                passwordError:true,
            })
        }
        else{
            setError({
                idError: false,
                passwordError : false,
            })
        }
    }

    return {value, error, changeHandler, submitHandler};
}

export default useForm