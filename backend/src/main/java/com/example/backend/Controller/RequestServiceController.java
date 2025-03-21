// RequestServiceController.java
package com.example.backend.Controller;

import com.example.backend.DTO.RequestServiceDTO;
import com.example.backend.DTO.updateController.RequestServiceUpdateDTO;
import com.example.backend.Service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/request")
@CrossOrigin
public class RequestServiceController {

    @Autowired
    private RequestService requestService;

    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody RequestServiceDTO dto) {
        try {
            String response = requestService.saveRequest(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Controller method
    @PutMapping("/update")
    public String updateRequest(@RequestBody RequestServiceUpdateDTO requestServiceUpdateDTO) {
        String message = requestService.updateRequest(requestServiceUpdateDTO);
        return message;
    }

    @GetMapping(path = "/get-all-request")
    public List<RequestServiceDTO> getAllRequest() {

        List<RequestServiceDTO> allRequest = requestService.getAllRequest();
        return allRequest;
    }

}