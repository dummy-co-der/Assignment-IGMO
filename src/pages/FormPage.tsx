import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./FormPage.css";

// Interface for storing form input values
interface IFormInputValues {
    email: string;
    name: string;
    telephone: string;
}

// Function to retrieve form values from localStorage
function getFormValues() {
    const storedValues = localStorage.getItem("form");
    if (!storedValues) {
        return {
            email: "",
            name: "",
            telephone: "",
        };
    }
    return JSON.parse(storedValues);
}

const FormPage: React.FC = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState<IFormInputValues>(getFormValues);
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Store form values in localStorage when they change
    useEffect(() => {
        if (values.name && values.telephone && values.email) {
            localStorage.setItem("form", JSON.stringify(values));
        }
    }, [values]);

    // Check if there is data in localStorage on component mount
    // useEffect(() => {
    //     const storedValues = localStorage.getItem("form");
    //     if (!storedValues) {
    //         navigate("/"); // Redirect to home page if no data is present in localStorage
    //     }
    // }, [navigate]);

    // Handle form submission
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const userDetails = {
            name: values.name,
            telephone: values.telephone,
            email: values.email,
        };

        // Check if all fields are filled before submitting the form
        if (userDetails.name && userDetails.telephone && userDetails.email) {
            localStorage.setItem("form", JSON.stringify(userDetails));
            navigate("/second"); // Navigate to the "second" page after successful form submission
        } else {
            setFormSubmitted(true);
            alert("Please enter all fields."); // Show an alert if any field is missing
        }
    }

    // Handle changes in form inputs
    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setValues((previousValues) => ({
            ...previousValues,
            [event.target.name]: event.target.value,
        }));
        setFormSubmitted(false); // Reset formSubmitted state when the user makes changes
    }

    return (
        <div className="formpage">
            <h1> GrowMoreOrganic Assignment </h1>
            <h2> User Details Form </h2>
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            autoComplete="off"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="eg. Anuj Maheshwari"
                            onChange={handleChange}
                            value={values.name}
                        />
                    </label>

                    <label>
                        Telephone:
                        <input
                            type="text"
                            placeholder="eg. +91 2222-2222-22"
                            name="telephone"
                            id="telephone"
                            onChange={handleChange}
                            value={values.telephone}
                        />
                    </label>

                    <label>
                        Email:
                        <input
                            placeholder="eg. user.email@domain.com"
                            type="text"
                            name="email"
                            id="email"
                            onChange={handleChange}
                            value={values.email}
                        />
                    </label>

                    <Button type="submit"> Submit</Button>
                    {/* Show an error message if the form is submitted without filling all fields */}
                    {formSubmitted && !values.name && !values.telephone && !values.email && (
                        <p style={{ color: "red" }}>Please enter all fields.</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default FormPage;
