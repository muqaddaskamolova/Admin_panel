import { useEffect, useState } from "react";
import { toast } from 'react-toastify';  // Assuming you are using react-toastify for toast notifications

export const Dashboard = () => {
    const [category, setCategory] = useState([]);
    const [nameEn, setNameEn] = useState('');
    const [nameRu, setNameRu] = useState('');
    const [image, setImage] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editOpenModal, setEditOpenModal] = useState(false);  // Corrected state name
    const [editCategoryId, setEditCategoryId] = useState(null);  // State to track the category being edited
    const [errorMessage, setErrorMessage] = useState(''); // For error messages

    // Simulating a fetch categories call
    useEffect(() => {
        // Mocked data for testing purposes
        const mockCategories = [
            { id: 1, name_en: "Category 1 EN", name_ru: "Категория 1 RU", image_src: "image1.jpg" },
            { id: 2, name_en: "Category 2 EN", name_ru: "Категория 2 RU", image_src: "image2.jpg" },
        ];
        setCategory(mockCategories);
    }, []);

    // Handle image file selection
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Simulate submitting a new or edited category
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editOpenModal) {  // Corrected usage of state for edit mode
                // Simulate updating existing category
                const updatedCategory = category.map(item =>
                    item.id === editCategoryId ? { id: editCategoryId, name_en: nameEn, name_ru: nameRu, image_src: 'new_image.jpg' } : item
                );
                setCategory(updatedCategory);
                toast.success('Category updated successfully!');
            } else {
                // Simulate creating a new category
                const newCategory = {
                    id: category.length + 1,
                    name_en: nameEn,
                    name_ru: nameRu,
                    image_src: image
                };
                setCategory([...category, newCategory]);
                toast.success('Category added successfully!');
            }

            // Reset form fields and close modal
            setNameEn('');
            setNameRu('');
            setImage(null);
            setOpenModal(false);
            setEditOpenModal(false);  // Reset edit mode after submission
            setErrorMessage(''); // Clear any previous error message
        } catch (error) {
            console.error("Error adding/updating category:", error);
            setErrorMessage("Error adding/updating category. Please try again."); // Set error message
        }
    };

    // Simulate editing category
    const handleEdit = (id) => {
        const categoryToEdit = category.find((item) => item.id === id);
        setNameEn(categoryToEdit.name_en);
        setNameRu(categoryToEdit.name_ru);
        setImage(null);  // Reset image, the user can select a new image if they want to update it
        setEditCategoryId(id);
        setEditOpenModal(true);  // Set edit mode
        modalOpenFunction();  // Open the modal for editing
    };

    // Simulate delete category
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const updatedCategories = category.filter(item => item.id !== id);
            setCategory(updatedCategories);
            toast.success('Category deleted successfully!');
        }
    };

    // Function to toggle modal for editing
    const modalOpenFunction = () => {
        setOpenModal(!openModal);
    };

    // Function to toggle modal for adding
    const modalOpenFunctionAdd = () => {
        setEditOpenModal(false); // Reset to add mode
        setNameEn('');
        setNameRu('');
        setImage(null);
        setOpenModal(true); // Open modal for adding
    };

    return (
        <div className="container mt-5 text-center">
            <h3>My Dashboard</h3>
            <div className="table-responsive mx-auto">
                {/* Button to trigger modal for new category */}
                <button type="button" className="btn btn-lg btn-primary" onClick={modalOpenFunctionAdd}>
                    Add Info
                </button>

                {/* Modal */}
                {openModal && (
                    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="staticBackdropLabel" aria-hidden="false">
                        <div className="modal-dialog">
                            <form className="modal-content" onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel"> {editOpenModal ? 'Edit Info' : 'Add Info'}</h5>
                                    <button type="button" className="btn-close" onClick={() => setOpenModal(false)} aria-label="Close"></button>
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
                                            required={!editOpenModal}  // Image is required only when adding a new category
                                        />
                                    </div>
                                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Error message display */}
                                </div>
                                <div className="modal-footer">
    <button type="submit" className="btn btn-primary">
        {editOpenModal ? 'Update' : 'Add'}
    </button>
    {/* Cancel button with functionality */}
    <button type="button" className="btn btn-secondary" onClick={() => {
        setOpenModal(false);  // Close the modal
        setNameEn('');  // Reset the name fields
        setNameRu('');
        setImage(null);  // Clear the image selection
        setEditOpenModal(false);  // Reset edit mode
    }}>
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
                    {category?.map((item, index) => (
                        <tr key={index}>
                            <td>{item?.name_en}</td>
                            <td>{item?.name_ru}</td>
                            <td>
                                <img src={`https://api.dezinfeksiyatashkent.uz/api/uploadsimages/${item?.image_src}`} alt={item?.name_en} style={{ width: '100px' }} />
                            </td>
                            <td className='d-flex justify-content-around'>
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
