import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import "./SecondPage.css";
import axios from 'axios';

// Interface for the Post object fetched from the API
interface Post {
    id: number;
    title: string;
    body: string;
}

const SecondPage: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [departmentData, setDepartmentData] = useState<Department[]>([]);

    useEffect(() => {
        // Fetch department data from the local JSON file
        axios
            .get('/departmentData.json')
            .then((response) => {
                setDepartmentData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching department data:', error);
            });

        // Fetch posts data from the API
        axios
            .get('https://jsonplaceholder.typicode.com/posts')
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Define columns for the DataGrid
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Title', width: 500 },
        { field: 'body', headerName: 'Body', width: 550 },
    ];

    return (
        <div className='second'>
            <h1 className='heading'> GrowMoreOrganic Assignment </h1>
            <div style={{ height: 420, width: '100%' }}>
                <DataGrid
                    rows={posts}
                    columns={columns}
                />
            </div>
            <div className='topbar'>
                <h1 className='heading'> Department List </h1>
                <Button onClick={() => navigate(-1)}> Go Back Home </Button>
            </div>
            {/* Render the DepartmentList component with departmentData */}
            <DepartmentList data={departmentData} />
        </div>
    );
};

// Interface for the Department object containing department and sub-department data
interface Department {
    department: string;
    sub_departments: string[];
}

// Interface for the props of the DepartmentList component
interface DepartmentListProps {
    data: Department[];
}

const DepartmentList: React.FC<DepartmentListProps> = ({ data }) => {
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [selectedSubDepartments, setSelectedSubDepartments] = useState<{ [key: string]: string[] }>({});
    const [expandedDepartments, setExpandedDepartments] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        // Initialize selectedSubDepartments with empty arrays for all sub-departments of each department
        const initialSelectedSubDepartments: { [key: string]: string[] } = {};
        data.forEach((department) => {
            initialSelectedSubDepartments[department.department] = [];
        });
        setSelectedSubDepartments(initialSelectedSubDepartments);
    }, [data]);

    useEffect(() => {
        // Check if all sub-departments of a department are selected and update the selectedDepartments state accordingly
        const updatedSelectedDepartments = data.filter((department) => {
            return department.sub_departments.every((subDept) =>
                selectedSubDepartments[department.department]?.includes(subDept)
            );
        }).map((department) => department.department);

        setSelectedDepartments(updatedSelectedDepartments);
    }, [selectedSubDepartments]);

    const handleDepartmentCheckboxChange = (department: string, event: React.ChangeEvent<HTMLInputElement>) => {
        // Check if the clicked element is the checkbox or the text inside the department section
        if (event.target.tagName !== "INPUT") {
            setExpandedDepartments((prevExpanded) => ({
                ...prevExpanded,
                [department]: !prevExpanded[department],
            }));
        }

        setSelectedSubDepartments((prevSubSelected) => {
            const updatedSubSelected = { ...prevSubSelected };
            const allSubDepartments = data.find((dept) => dept.department === department)?.sub_departments || [];

            if (!selectedDepartments.includes(department)) {
                // Check department and all sub-departments
                updatedSubSelected[department] = allSubDepartments;
                setSelectedDepartments((prevSelected) => [...prevSelected, department]);
                // Check all sub-departments
                allSubDepartments.forEach((subDept) => {
                    if (!selectedSubDepartments[department]?.includes(subDept)) {
                        handleSubDepartmentCheckboxChange(department, subDept);
                    }
                });
            } else {
                // Uncheck department and all sub-departments
                delete updatedSubSelected[department];
                setSelectedDepartments((prevSelected) => prevSelected.filter((dept) => dept !== department));
                // Uncheck all sub-departments
                allSubDepartments.forEach((subDept) => {
                    if (selectedSubDepartments[department]?.includes(subDept)) {
                        handleSubDepartmentCheckboxChange(department, subDept);
                    }
                });
            }

            return updatedSubSelected;
        });
    };


    const handleExpandCollapseClick = (department: string) => {
        setExpandedDepartments((prevExpanded) => ({
            ...prevExpanded,
            [department]: !prevExpanded[department],
        }));
    };

    const handleSubDepartmentCheckboxChange = (department: string, subDept: string) => {
        setSelectedSubDepartments((prevSelected) => {
            const updatedSelected = { ...prevSelected };
            if (updatedSelected[department]?.includes(subDept)) {
                // Uncheck sub-department
                updatedSelected[department] = updatedSelected[department]?.filter((sub) => sub !== subDept);
            } else {
                // Check sub-department
                updatedSelected[department] = [...(updatedSelected[department] || []), subDept];
            }
            return updatedSelected;
        });
    };

    return (
        <div>
            {data.map((department: Department) => (
                <div key={department.department}>
                    <ul className='department'>
                        <li style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography className='collapse' onClick={() => handleExpandCollapseClick(department.department)}>
                                {expandedDepartments[department.department] ? '-' : '+'}
                            </Typography>
                            <div>
                                <Checkbox
                                    checked={selectedDepartments.includes(department.department)}
                                    onChange={(event) => handleDepartmentCheckboxChange(department.department, event)}
                                />
                            </div>
                            <Typography>{department.department}</Typography>
                        </li>
                    </ul>
                    {/* Check if the department's sub-departments are expanded */}
                    {expandedDepartments[department.department] && (
                        <ul className='subDepartment'>
                            {department.sub_departments.map((subDept: string) => (
                                <li key={subDept}>
                                    <Checkbox
                                        checked={selectedSubDepartments[department.department]?.includes(subDept)}
                                        onChange={() => handleSubDepartmentCheckboxChange(department.department, subDept)}
                                    />
                                    <Typography className='subname'>{subDept}</Typography>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );

};

export default SecondPage;
