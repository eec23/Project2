import { useState } from 'react';
import type { Product } from '../types';

interface Props {
  product: Product | null;
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: Props) {
  const [firstName, setFirstName] = useState(product?.first_name ?? '');
  const [lastName, setLastName] = useState(product?.last_name ?? '');
  const [height, setHeight] = useState(product?.height ?? '');
  const [weight, setWeight] = useState(product?.weight ?? '');
  const [age, setAge] = useState(product?.age ?? '');


  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!firstName.trim() || !lastName.trim() || height === '' || weight === '' || age === '') {
      setError('All fields required');
      return;
    }

    const heightNum = Number(height);
    const weightNum = Number(weight);
    const ageNum = Number(age);

    if (heightNum <= 0 || weightNum <= 0 || ageNum <= 0) {
      setError('Height, Weight, and Age must be greater than zero');
      return;
    }

    onSave({first_name: firstName, last_name: lastName, height: heightNum, weight: weightNum, age: ageNum,});
  }

  return (
    <div>
      <h2>{product ? 'Edit Player' : 'Add New Player'}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>

            <label>
              First Name 
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label>
              Last Name
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>

            <label>
              Height (in)
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </label>

            <label>
              Weight (lbs)
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </label>

            <label>
              Age (yrs)
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="primary" type="submit">
            {product ? 'Save Changes' : 'Add Item'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
