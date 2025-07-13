import React, {useEffect, useState} from 'react';
import kinopoiskEmpty from '../../img/kinopoisk_empty.webp';
import './all_kino.css';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Icon from '@mui/material/Icon';
import KinoHeader from '../kino_header/kino_header';
import Modal from '@mui/material/Modal';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Rating,
    Slider,
    Typography
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const API_URL = process.env.REACT_APP_KINOPOISK_API_URL!;
const API_KEY = process.env.REACT_APP_KINOPOISK_API_KEY;

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<Kino[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('favoriteMovies');
        if (saved) {
            const parsed = JSON.parse(saved);
            setFavorites(parsed);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
        }
    }, [favorites, isLoaded]);

    const toggleFavorite = (movie: Kino) => {
        setFavorites(prev =>
            prev.some(f => f.id === movie.id)
                ? prev.filter(f => f.id !== movie.id) : [...prev, movie]
        );
    };

    return { favorites, toggleFavorite };
};

type RatingType = {
    kp: number;
    imdb: number;
    filmCritics: number;
    russianFilmCritics: number;
    await: number;
};
type Genre = { name: string };
type Poster = { url: string; previewUrl: string };

export type Kino = {
    id: number;
    alternativeName: string;
    name: string;
    poster: Poster;
    year: string;
    rating: RatingType;
    description?: string;
    genres: Genre[];
};

const ModalWindow = ({
                         open,
                         handleClose,
                         movie,
                     }: {
    open: boolean;
    handleClose: () => void;
    movie: Kino | null;
}) => {
    const { favorites, toggleFavorite } = useFavorites();
    if (!movie) return null;
    const isFavorite = favorites.some(f => f.id === movie.id);
    const onAction = () => {
        toggleFavorite(movie);
        handleClose();
    };
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)', width: 400,
                bgcolor: 'background.paper', border: '2px solid #000',
                boxShadow: 24, p: 4
            }}>
                <Typography variant="h6">
                    {movie.name || movie.alternativeName}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    {isFavorite ? 'Удалить из избранного?' : 'Добавить в избранное?'}
                </Typography>
                <Button sx={{ mt: 1, color: "#FF6200" }} onClick={onAction}>
                    {isFavorite ? 'Удалить' : 'Добавить'}
                </Button>
            </Box>
        </Modal>
    );
};

function AllKino() {
    const DEFAULT_RATING = 7;
    const DEFAULT_YEAR = 2020;
    const LIMIT = 50;
    const PAGE = 1;

    const [allKino, setAllKino] = useState<Kino[]>([]);
    const [page, setPage] = useState(PAGE);
    const [isLoading, setIsLoading] = useState(false);

    const [rating, setRating] = useState(DEFAULT_RATING);
    const [year, setYear] = useState(DEFAULT_YEAR);
    const [genres, setGenres] = useState<string[]>([]);
    const [sliderYear, setSliderYear] = useState<number>(year)

    const [open, setOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Kino | null>(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const next = new URLSearchParams(searchParams);
        next.delete('genres.name');
        next.delete('rating.imdb');
        next.delete('year');
        next.set('rating.imdb', `${rating}-10`);
        next.set('year', String(year));
        genres.forEach(g => next.append('genres.name', g.toLowerCase()));

        setSearchParams(next, { replace: true });
        setAllKino([]);
        setPage(1);
    }, [rating, genres, year]);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('page', String(page));
                params.append('limit', String(LIMIT));
                params.append('type', 'movie');
                params.append('notNullFields', 'name');

                params.append('rating.imdb', `${rating}-10`);
                params.append('year', String(year));
                genres.forEach(g => params.append('genres.name', g.toLowerCase()));

                const url = `${API_URL}?${params.toString()}`;
                const res = await fetch(url, {
                    headers: {
                        'X-API-KEY': API_KEY!,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await res.json();
                let movies: Kino[] = Array.isArray(data.docs) ? data.docs : [];
                setAllKino(prev => ([...prev, ...movies]));
            } catch (e) {
                console.error('Ошибка загрузки:', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, [rating, year, genres, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY
                >= document.documentElement.scrollHeight - 5
            ) {
                setPage(prev => prev + 1);
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        setSliderYear(year)
    }, [year])

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setGenres(prev => checked ? [...prev, name] : prev.filter(g => g !== name)
        );
    };

    const openModal = (movie: Kino) => {
        setSelectedMovie(movie);
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
        setSelectedMovie(null);
    };

    if (isLoading && allKino.length === 0) {
        return (
            <div className="loading">
            <KinoHeader/>
                <div className="loader_wrapper"><span className="loader"></span></div>
            </div>
        );
    }

    return (
        <div className="all_kino_wrapper">
            <KinoHeader />
            <div className="filter_wrapper">
                <div className="filter">
                    <div className="filter_rating_slider">
                        <div className="filter_rating">
                        <span className="filter_rating_text">Рейтинг</span>
                    <Rating
                        value={rating}
                        precision={0.1}
                        max={10}
                        name="customized-10"
                        icon={
                            <StarIcon
                                sx={{
                                    color: '#FFC107',
                                    stroke: '#FF6200',
                                    strokeWidth: 1,
                                }}
                            />
                        }
                        emptyIcon={
                            <StarIcon
                                sx={{
                                    opacity: "0.7",
                                    color: '#FF6200',
                                    stroke: '#FF6200',
                                    strokeWidth: 1,
                                }}
                            />
                        }
                        onChange={(_, v) => setRating(v ?? DEFAULT_RATING)}
                    />
                        </div>
                        <div className="filter_year">
                        <span className="filter_year_text">Год</span>
                    <Slider
                        sx={{
                            color: '#FF6200',
                        }}
                        value={sliderYear}
                        onChange={(_, v) => setSliderYear(v as number)}
                        onChangeCommitted={(_, v) => setYear(v as number)}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1990}
                        max={2025}
                    />
                        </div>
                    </div>
                    <FormControl sx={{
                        marginTop: "25px",
                        color: '#FF6200',
                        fontSize: "18px",
                        fontWeight: 'bold',
                    }} component="fieldset" variant="standard">
                        <FormLabel sx={{
                            color: '#FF6200',
                            fontSize: "18px",
                            fontWeight: 'bold',
                            marginBottom: "10px",
                            '&.Mui-focused': {
                                color: '#FF6200',
                            },
                        }} component="legend">Жанры</FormLabel>
                        <FormGroup sx={{
                            color: '#FF6200',
                            fontSize: "18px",
                            fontWeight: 'bold',
                            flexDirection: 'row',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px 20px',
                        }}>
                            {['Драма','Комедия','Фэнтези','Боевик','Фантастика','Детектив','Ужасы'].map(g => (
                                <FormControlLabel
                                    key={g}
                                    control={
                                        <Checkbox
                                            checked={genres.includes(g)}
                                            onChange={handleGenreChange}
                                            name={g}
                                            sx={{
                                                color: '#FF6200',
                                                '&.Mui-checked': {
                                                    color: '#FF6200',
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255, 98, 0, 0.04)',
                                                },
                                                '&.Mui-focusVisible': {
                                                    outline: '2px solid #FF6200',
                                                },
                                            }}
                                        />
                                    }
                                    label={g}
                                    sx={{
                                        color: '#FF6200',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 98, 0, 0.05)',
                                        },
                                    }}
                                />

                            ))}
                        </FormGroup>
                    </FormControl>
                </div>
            </div>
            <ModalWindow open={open} handleClose={closeModal} movie={selectedMovie} />
            <ul className="all_kino">
                {allKino.map((item, i) => (
                    <li
                        className="kino"
                        key={i}
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
                                onClick={e => { e.stopPropagation(); openModal(item); }}
                                className="fa-plus-circle"
                                sx={{
                                    position: 'absolute', right: 10, bottom: 10,
                                    fontSize: 40, color: '#FF6200',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    borderRadius: '50%', padding: '4px',
                                    '&:hover': { opacity: 0.7, cursor: 'pointer' }
                                }}
                            >star</Icon>
                        </div>
                        <Typography className="kino_name">{item.name || item.alternativeName}</Typography>
                        <Typography className="kino_year">{item.year}</Typography>
                        <Typography className="kino_rating">
                            Рейтинг: {item.rating.imdb ?? 'N/A'}
                        </Typography>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AllKino;
