import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Kino} from "../all_kino/all_kino";
import kinopoiskEmpty from "../../img/kinopoisk_empty.webp";
import KinoHeader from "../kino_header/kino_header";
import "./kinosite.css";

function KinoSite(props: any) {
    const { id } = useParams();
    const [kinoInfo, setKinoInfo] = useState<Kino>();
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        fetch(`https://api.kinopoisk.dev/v1.4/movie/${id}`,
            {headers: {
                'X-API-KEY': "2YYP5NE-6Q14X3Q-P93WARY-KP5QEKJ",
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then((data) => {
                setKinoInfo(data);
                setLoading(false);
            });
    },[id]);

    if (loading) {
        return <div className="loading">
            <KinoHeader/>
            <div className="loader_wrapper">
                <span className="loader"></span>
            </div>

        </div>
    }

    return (
        <div className="kino_info_wrapper">
            <KinoHeader/>
            <div className="kino_info">
                <div className="kino_img">
                    <img width={700} height={900} src={kinoInfo?.poster?.url || kinopoiskEmpty} alt={kinoInfo?.name || kinoInfo?.alternativeName} />
                </div>
                <div className="kino_desc">
                    <div className="kino_name_info">{kinoInfo?.name || kinoInfo?.alternativeName}</div>
                    <div className="kino_description_info">{kinoInfo?.description || 'Описания нет.'}</div>
                    <div className="kino_rating_info">Рейтинг: {kinoInfo?.rating.imdb || "Отсутствует."}</div>
                    <div className="kino_year_info">Год выпуска: {kinoInfo?.year}</div>
                    <div className="kino_genre_info">Жанры:</div>
                    <ul className="kino_ul_info">
                        {kinoInfo?.genres.map((item, i) => {
                        return <li key={i}>{item.name}</li>
                    })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default KinoSite;