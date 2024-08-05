import { image } from "../../../config/constant/image";
interface ButtonProps {
    name: string;
    type? : 'submit' | 'reset' | 'button' | undefined;
    disabled?: boolean;
    buttonText: string
}

const Button : React.FC<ButtonProps> = ({
    name, 
    type = undefined,
    disabled = false,
    buttonText
}) => {
    return (
        <div>
        <button type = {type} disabled = {disabled}>
        {disabled ? (
            <img src={image?.loader} alt="" />
        ): (
            name
        )}
        <span>{buttonText}</span>
        </button>
        </div>
    )
}

export default Button