package com.lliscano.controller;

import com.lliscano.dto.OrderDTO;
import com.lliscano.dto.ResponseDTO;
import com.lliscano.service.OrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping(value = "/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    public ResponseEntity<ResponseDTO<OrderDTO>> createUser(
            @RequestBody @Valid OrderDTO orderDTO
    ) {
        return new ResponseEntity<>(this.service.saveOrder(orderDTO), HttpStatus.CREATED);
    }
}
