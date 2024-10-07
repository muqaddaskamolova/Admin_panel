import { useState } from "react";
import { toast } from 'react-toastify';

export const Dashboard = () => {
    const [category, setCategory] = useState([]);
    const [nameEn, setNameEn] = useState('');
    const [nameRu, setNameRu] = useState('');
    const [image, setImage] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editOpenModal, setEditOpenModal] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const BASE_URL = process.env.REACT_APP_BASE_URL || "https://api.dezinfeksiyatashkent.uz/api/sources/";

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let imageSrc;

            if (!editOpenModal || (editOpenModal && image)) {
                imageSrc = await uploadImage(image);
            } else {
                imageSrc = category.find(item => item.id === editCategoryId).image_src; 
            }

            if (editOpenModal) {
                const updatedCategory = category.map(item =>
                    item.id === editCategoryId
                        ? { id: editCategoryId, name_en: nameEn, name_ru: nameRu, image_src: imageSrc }
                        : item
                );
                setCategory(updatedCategory);
                toast.success('Category updated successfully!');
            } else {
                const newCategory = {
                    id: category.length + 1,
                    name_en: nameEn,
                    name_ru: nameRu,
                    image_src: imageSrc 
                };
                setCategory([...category, newCategory]);
                toast.success('Category added successfully!');
            }

            resetForm();
        } catch (error) {
            console.error("Error adding/updating category:", error);
            setErrorMessage("Error adding/updating category. Please try again.");
        }
    };

    const uploadImage = async (file) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`uploads/${file.name}`); // Simulated image upload URL
            }, 1000);
        });
    };

    const resetForm = () => {
        setNameEn('');
        setNameRu('');
        setImage(null);
        setOpenModal(false);
        setEditOpenModal(false);
        setErrorMessage('');
    };

    const handleEdit = (id) => {
        const categoryToEdit = category.find((item) => item.id === id);
        setNameEn(categoryToEdit.name_en);
        setNameRu(categoryToEdit.name_ru);
        setImage(null); 
        setEditCategoryId(id);
        setEditOpenModal(true);
        setOpenModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const updatedCategories = category.filter(item => item.id !== id);
            setCategory(updatedCategories);
            toast.success('Category deleted successfully!');
        }
    };

    const modalOpenFunctionAdd = () => {
        setEditOpenModal(false);
        resetForm();
        setOpenModal(true);
    };

    return (
        <div className="container mt-5 text-center">
            <div className="table-responsive mx-auto">
                <button type="button" className="btn btn-lg btn-primary mb-4" onClick={modalOpenFunctionAdd}>
                    Add Info
                </button>

                {openModal && (
                    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="staticBackdropLabel" aria-hidden="false">
                        <div className="modal-dialog">
                            <form className="modal-content" onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">{editOpenModal ? 'Edit Info' : 'Add Info'}</h5>
                                    <button type="button" className="btn-close" onClick={resetForm} aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            placeholder="Name (EN)"
                                            className="form-control"
                                            value={nameEn}
                                            onChange={(e) => setNameEn(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            placeholder="Name (RU)"
                                            className="form-control"
                                            value={nameRu}
                                            onChange={(e) => setNameRu(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={handleImageChange}
                                            required={!editOpenModal}
                                        />
                                    </div>
                                    {image && <img src={URL.createObjectURL(image)} alt="Selected" className="preview-image" />}
                                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">
                                        {editOpenModal ? 'Update' : 'Add'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <table className="table table-dark table-striped-columns">
                <thead>
                    <tr>
                        <th scope="col">Name (EN)</th>
                        <th scope="col">Name (RU)</th>
                        <th scope="col">Image</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {category.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name_en}</td>
                            <td>{item.name_ru}</td>
                            <td>
                                {item.image_src && (
                                    <img
                                        src={`${BASE_URL}${item.image_src}`}
                                        alt={item.name_en}
                                        className="category-image"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100'; }} // Fallback image on error
                                    />
                                )}
                            </td>
                            <td className='d-flex justify-content-around align-items-start action-cell'>
                                <button className="btn btn-warning text-light me-1" onClick={() => handleEdit(item.id)}>
                                    Edit
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
