import React from 'react';
import KinoHeader from "../kino_header/kino_header";
import { Kino, useFavorites } from "../all_kino/all_kino";
import kinopoiskEmpty from "../../img/kinopoisk_empty.webp";
import { useNavigate } from "react-router-dom";
import "./favorite.css";
import Icon from "@mui/material/Icon";

const Favorite = () => {
    const { favorites, toggleFavorite } = useFavorites();
    const navigate = useNavigate();

    const handleRemoveFavorite = (movie: Kino, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(movie);
    };

    return (
        <div className="favorite_wrapper">
            <KinoHeader />
            <div className="favorite-content">
                <h2>Избранные фильмы</h2>

                {favorites.length === 0 ? (
                    <div className="no-favorites">Список пуст...</div>
                ) : (
                    <ul className="all_kino">
                        {favorites.map(item => (
                            <li
                                className="kino"
                                key={item.id}
                                onClick={() => navigate(`/kino/${item.id}`)}
                            >
                                <div className="image-container" style={{ position: 'relative' }}>
                                    <img
                                        className="kino_picture"
                                        width={280}
                                        height={320}
                                        src={item.poster?.url || kinopoiskEmpty}
                                        alt={item.name || item.alternativeName}
                                    />
                                    <Icon
                                        onClick={e => handleRemoveFavorite(item, e)}
                                        className="fa-plus-circle"
                                        sx={{
                                            position: 'absolute',
                                            right: 10,
                                            bottom: 10,
                                            fontSize: 40,
                                            color: '#FF6200',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            borderRadius: '50%',
                                            padding: '4px',
                                            '&:hover': { opacity: 0.7, cursor: 'pointer' }
                                        }}
                                    >
                                        delete
                                    </Icon>
                                </div>
                                <div className="kino_name">{item.name || item.alternativeName}</div>
                                <div className="kino_year">{item.year}</div>
                                <div className="kino_rating">
                                    Рейтинг: {item.rating?.imdb ?? "N/A"}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Favorite;
