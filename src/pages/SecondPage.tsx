import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Checkbox } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import "./SecondPage.css";
import axios from 'axios';

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
        axios
            .get('/departmentData.json')
            .then((response) => {
                setDepartmentData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching department data:', error);
            });

        axios
            .get('https://jsonplaceholder.typicode.com/posts')
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Title', width: 500 },
        { field: 'body', headerName: 'Body', width: 600 },
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
            <DepartmentList data={departmentData} />
        </div>
    );
};

interface Department {
    department: string;
    sub_departments: string[];
}

interface DepartmentListProps {
    data: Department[];
}

const DepartmentList: React.FC<DepartmentListProps> = ({ data }) => {
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [selectedSubDepartments, setSelectedSubDepartments] = useState<{ [key: string]: string[] }>({});

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
            return department.sub_departments.every((subDept) => selectedSubDepartments[department.department]?.includes(subDept));
        }).map((department) => department.department);

        setSelectedDepartments(updatedSelectedDepartments);
    }, [selectedSubDepartments]);

    const handleDepartmentCheckboxChange = (department: string) => {
        setSelectedDepartments((prevSelected) => {
            if (prevSelected.includes(department)) {
                // Uncheck department and all sub-departments
                const updatedSelected = prevSelected.filter((dept) => dept !== department);
                setSelectedSubDepartments((prevSubSelected) => {
                    const updatedSubSelected = { ...prevSubSelected };
                    delete updatedSubSelected[department];
                    return updatedSubSelected;
                });
                return updatedSelected;
            } else {
                // Check department and all sub-departments
                setSelectedSubDepartments((prevSubSelected) => {
                    const updatedSubSelected = { ...prevSubSelected, [department]: data.find((dept) => dept.department === department)?.sub_departments || [] };
                    return updatedSubSelected;
                });
                return [...prevSelected, department];
            }
        });
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
                        <li>
                            <Checkbox
                                checked={selectedDepartments.includes(department.department)}
                                onChange={() => handleDepartmentCheckboxChange(department.department)}
                            />
                            <Typography>{department.department}</Typography>
                        </li>
                    </ul>
                    <ul className='subDepartment'>
                        {department.sub_departments.map((subDept: string) => (
                            <li key={subDept}>
                                <Checkbox
                                    checked={selectedSubDepartments[department.department]?.includes(subDept)}
                                    onChange={() => handleSubDepartmentCheckboxChange(department.department, subDept)}
                                />
                                <Typography>{subDept}</Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default SecondPage;
