
import * as Yup from 'yup'
const LoginSchema = () => {
    const schema = Yup.object ({
        email:Yup.string().required(
        )
    })
}