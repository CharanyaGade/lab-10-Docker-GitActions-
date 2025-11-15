package com.klef.demo;

import java.util.List;

public interface PlaceService {
    Place addPlace(Place place);
    List<Place> viewAllPlaces();
    Place getPlaceById(int id);
    Place updatePlace(Place place);
    void deletePlace(int id);
}
