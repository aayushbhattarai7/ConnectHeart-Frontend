import React from 'react';
import RequiredSign from './RequiredSign';

interface ILabel {
  name: string;
  label: string;
  required?: boolean;
  className?:string
}

const Label: React.FC<ILabel> = ({ name, label, required, className }) => {
  return (
    <label htmlFor={name} className={` ${className}`}>
      {label} {required && <RequiredSign />}
    </label>
  );
};

export default Label;
