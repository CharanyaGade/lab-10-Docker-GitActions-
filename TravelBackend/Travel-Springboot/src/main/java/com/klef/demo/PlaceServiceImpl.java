package com.klef.demo;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlaceServiceImpl implements PlaceService {

    @Autowired
    private PlaceRepository placeRepository;

    @Override
    public Place addPlace(Place place) {
        return placeRepository.save(place);
    }

    @Override
    public List<Place> viewAllPlaces() {
        return placeRepository.findAll();
    }

    @Override
    public Place getPlaceById(int id) {
        return placeRepository.findById(id).orElse(null);
    }

    @Override
    public Place updatePlace(Place place) {
        return placeRepository.save(place);
    }

    @Override
    public void deletePlace(int id) {
        placeRepository.deleteById(id);
    }
}
