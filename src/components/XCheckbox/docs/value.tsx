import React, { useState } from 'react';
import { XCheckbox } from 'antd-x-form';

export default function() {
  const [checked, setChecked] = useState(false);

  return (
    <XCheckbox value={checked} onChange={e => setChecked(e.target.checked)} />
  );
}
