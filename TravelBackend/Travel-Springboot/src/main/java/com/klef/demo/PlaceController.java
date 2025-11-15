package com.klef.demo;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/places")
@CrossOrigin(origins = "*")
public class PlaceController {

    @Autowired
    private PlaceService placeService;

    @GetMapping("/")
    public String home() {
        return "Travel Wishboard API is running...";
    }

    @PostMapping("/add")
    public ResponseEntity<Place> addPlace(@RequestBody Place place) {
        Place savedPlace = placeService.addPlace(place);
        return new ResponseEntity<>(savedPlace, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Place>> getAllPlaces() {
        List<Place> places = placeService.viewAllPlaces();
        return new ResponseEntity<>(places, HttpStatus.OK);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getPlaceById(@PathVariable int id) {
        Place place = placeService.getPlaceById(id);
        if (place != null) {
            return new ResponseEntity<>(place, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Place with ID " + id + " not found.", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePlace(@RequestBody Place place) {
        Place existing = placeService.getPlaceById(place.getId());
        if (existing != null) {
            Place updated = placeService.updatePlace(place);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot update. Place with ID " + place.getId() + " not found.", HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePlace(@PathVariable int id) {
        Place existing = placeService.getPlaceById(id);
        if (existing != null) {
            placeService.deletePlace(id);
            return new ResponseEntity<>("Place with ID " + id + " deleted successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot delete. Place with ID " + id + " not found.", HttpStatus.NOT_FOUND);
        }
    }
}
