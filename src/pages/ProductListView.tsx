import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import ProductForm from '../components/ProductForm';

interface Props {
  user: User | null;
}

export default function ProductListView({ user }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);

     const { data, error } = await supabase
       .from('players')
       .select('*')
       .order('created_at', { ascending: false });
    
     if (error) setError(error.message);
     else setProducts(data ?? []);

    setLoading(false);
  }

  async function handleAdd(data: Partial<Product>) {
    if (!user) return;

     const { error } = await supabase
       .from('players')
       .insert([{ ...data, user_id: user.id }]);
    
     if (error) { alert(error.message); return; }
     setShowForm(false);
     fetchProducts();

    console.log('Add:', data);
  }

  async function handleEdit(data: Partial<Product>) {
    if (!editing) return;

     const { error } = await supabase
       .from('players')
       .update(data)
       .eq('id', editing.id);
    
     if (error) { alert(error.message); return; }
     setEditing(null);
     fetchProducts();

    console.log('Edit:', editing.id, data);
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;

     const { error } = await supabase.from('players').delete().eq('id', id);
     if (error) { alert(error.message); return; }
     fetchProducts();

    console.log('Delete:', id);
  }

  if (loading) return <p>Loading players...</p>;
  if (error) return <p className="error">Failed to load: {error}</p>;

  if (showForm || editing) {
    return (
      <ProductForm
        product={editing}
        onSave={editing ? handleEdit : handleAdd}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ flex: 1 }}>Player Profiles</h1>
      </div>

      {user && (
          <button className="primary add" onClick={() => setShowForm(true)}>
            + Add New
          </button>
        )}

      {products.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>
          No players yet. {user ? 'Click “Add New” to create one.' : 'Sign in to add the first player.'}
        </p>
      ) : (
        products.map((p) => (
          <div key={p.id} className="card" style={{ width: '100%', minWidth: 300}}>

            <h3>{p.first_name} {p.last_name}</h3>
            <p><strong>Height:</strong> {p.height} in</p>
            <p><strong>Weight:</strong> {p.weight} lbs</p>
            <p><strong>Age:</strong> {p.age} yrs</p>

            {user && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => setEditing(p)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
