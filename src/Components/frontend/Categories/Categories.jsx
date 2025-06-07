import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../Context/AuthContext'

export default function Categories() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryType, setNewCategoryType] = useState('expense')
  const [editingCategory, setEditingCategory] = useState(null)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      setCategories(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories')
      console.error(err)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCategories()
    }
  }, [user])

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    try {
      const endpoint = user.role === 'admin' ? '/api/categories/default' : '/api/categories'
      const response = await axios.post(endpoint, {
        name: newCategoryName,
        type: newCategoryType,
      })
      setCategories([...categories, response.data])
      setNewCategoryName('')
      setNewCategoryType('expense')
      setMessage('Category added successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category')
    }
  }

  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    if (!editingCategory) return

    try {
      const endpoint = editingCategory.isDefault && user.role === 'admin'
        ? `/api/categories/default/${editingCategory._id}`
        : `/api/categories/${editingCategory._id}`

      const response = await axios.put(endpoint, {
        name: editingCategory.name,
        type: editingCategory.type,
      })
      setCategories(categories.map(cat => (cat._id === editingCategory._id ? response.data : cat)))
      setEditingCategory(null)
      setMessage('Category updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update category')
    }
  }

  const handleDeleteCategory = async (id, isDefault) => {
    setError(null)
    setMessage(null)
    if (!window.confirm('Are you sure you want to delete this category?')) return

    try {
      const endpoint = isDefault && user.role === 'admin'
        ? `/api/categories/default/${id}`
        : `/api/categories/${id}`

      await axios.delete(endpoint)
      setCategories(categories.filter(cat => cat._id !== id))
      setMessage('Category deleted successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Manage Categories</h1>

      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="card mb-8">
        <h2 className="text-2xl font-semibold mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
        <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="space-y-4">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              id="category-name"
              type="text"
              className="input mt-1"
              value={editingCategory ? editingCategory.name : newCategoryName}
              onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, name: e.target.value }) : setNewCategoryName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="category-type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="category-type"
              className="input mt-1"
              value={editingCategory ? editingCategory.type : newCategoryType}
              onChange={(e) => editingCategory ? setEditingCategory({ ...editingCategory, type: e.target.value }) : setNewCategoryType(e.target.value)}
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary mr-2">
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
          {editingCategory && (
            <button type="button" onClick={() => setEditingCategory(null)} className="btn btn-secondary">
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Existing Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-600">No categories found. Add a new one above!</p>
        ) : (
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
                <div>
                  <span className="font-medium">{category.name}</span>
                  <span className={`ml-2 text-sm px-2 py-0.5 rounded-full ${category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {category.type}
                  </span>
                  {category.isDefault && <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Default</span>}
                </div>
                <div>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="btn btn-secondary text-sm mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id, category.isDefault)}
                    className="btn btn-secondary text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
} 