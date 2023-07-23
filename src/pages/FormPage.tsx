import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./FormPage.css";

interface IFormInputValues {
    email: string;
    name: string;
    telephone: string;
}

function getFormValues() {
    const storedValues = localStorage.getItem("form");
    if (!storedValues)
        return {
            email: "",
            name: "",
            telephone: "",
        };
    return JSON.parse(storedValues);
}

const FormPage: React.FC = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState<IFormInputValues>(getFormValues);
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        localStorage.setItem("form", JSON.stringify(values));
    }, [values]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const userDetails = {
            name: values.name,
            telephone: values.telephone,
            email: values.email,
        };
        if (userDetails.name && userDetails.telephone && userDetails.email) {
            localStorage.setItem("userDetails", JSON.stringify(userDetails));
            navigate("/second");
        } else {
            setFormSubmitted(true);
            alert("Please enter all fields.");
        }
    }

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setValues((previousValues) => ({
            ...previousValues,
            [event.target.name]: event.target.value,
        }));
        setFormSubmitted(false);
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

                    <Button type="submit">Submit</Button>
                    {formSubmitted && (
                        <p style={{ color: "red" }}>Please enter all fields.</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default FormPage;
