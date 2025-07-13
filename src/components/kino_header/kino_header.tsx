import React from 'react';
import "./kino_header.css";
import kinopoiskLogo from '../../img/kinopoisk_logo.png';
import { Button } from '@mui/material';
import {useNavigate} from "react-router-dom";

const KinoHeader = () => {
    const navigate = useNavigate();
    return (
        <header className="header">
            <img width="400px"  src={kinopoiskLogo} alt="Логотип кинопоиска."/>
            <Button
                onClick={() => navigate(`/favorite`)}
                sx={{
                    backgroundColor: '#FF6200',
                    color: '#ffffff',
                    fontSize: '24px',
                    padding: '12px 24px',
                    fontWeight: 'bold',
                    '&:hover': {
                        opacity: "0.7"
                    }
                }}
            >
                Избранное
            </Button>
        </header>
    );
};

export default KinoHeader;