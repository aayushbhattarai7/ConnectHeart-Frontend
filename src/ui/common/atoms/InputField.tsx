import React, { useState } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';


interface InputFieldProps {
    placeholder?: string;
    type?: string;
    name: string;
    readOnly?: boolean;
    error?: FieldError;
    register: UseFormRegister<any>;
    multiple?: boolean
    onChange? : React.ChangeEventHandler<HTMLInputElement>
    className: string
}

const InputField: React.FC<InputFieldProps> = ({
    placeholder,
    type,
    name,
    readOnly,
    error,
    register,
    multiple,
    onChange,
    className


}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleField = () => {
        setShowPassword((prev) => !prev)
    }


    return (
        <div className=''>
            <input type={
                type && type === 'password'
                    ? showPassword
                        ? 'text' : 'password' : 'text'
            } readOnly={readOnly}
                placeholder={placeholder}
                multiple={multiple}
                {...register(name)}
                onChange={onChange}
                className='className'
            />
            {type === 'password' && (
                <span className='icon' onClick={toggleField}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
            )}
        </div>
    )
};

export default InputField