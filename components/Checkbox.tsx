import React from 'react';

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  const skipWords = ['of']; // Add any words you want to skip here
  const formattedLabel = label.split(' ').map((word, index) => {
    if (skipWords.includes(word.toLowerCase())) {
      return word + ' '; // Skip the word without adding a line break
    }
    return (
      <React.Fragment key={index}>
        {word}
        <br />
      </React.Fragment>
    );
  });

  return label === ''
  ? (
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ cursor: 'pointer' }}
      />
    )
  : (
      <label>
        {formattedLabel}
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
      </label>
    );

};

export default Checkbox;
