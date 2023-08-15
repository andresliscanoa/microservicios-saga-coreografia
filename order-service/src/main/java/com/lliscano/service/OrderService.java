package com.lliscano.service;

import com.lliscano.dto.OrderDTO;
import com.lliscano.dto.ResponseDTO;
import com.lliscano.dto.events.KafkaOrderCreatedDTO;
import com.lliscano.dto.events.KafkaPaymentDTO;
import com.lliscano.entity.Order;
import com.lliscano.exception.RecordNotFoundException;
import com.lliscano.mapper.OrderMapper;
import com.lliscano.repository.OrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@AllArgsConstructor
public class OrderService {

    private static final String TOPIC_PRODUCER = "order-created-topic";
    private final OrderRepository repository;
    private final OrderMapper mapper;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public ResponseDTO<OrderDTO> saveOrder(OrderDTO orderDTO) {
        orderDTO.setTransactionId(UUID.randomUUID().toString());
        this.repository.save(this.mapper.toEntity(orderDTO));
        this.kafkaTemplate.send(
                TOPIC_PRODUCER, KafkaOrderCreatedDTO.builder()
                        .event("order-created")
                        .data(orderDTO)
                        .build()
        );
        return ResponseDTO.<OrderDTO>builder()
                .timestamp(Instant.now())
                .data(orderDTO)
                .message("Order created successfully")
                .build();
    }

    public void updateOrderStatusCompleted(KafkaPaymentDTO kafkaPaymentDTO) {
        Order order = this.repository.findByTransactionId(kafkaPaymentDTO.getData().getTransactionId())
                .orElseThrow(() -> new RecordNotFoundException("Order not found by transaction id "+kafkaPaymentDTO.getData().getTransactionId()));
        if(kafkaPaymentDTO.getEvent().equalsIgnoreCase("payment-created")){
            order.setOrderStatus("COMPLETED");
            this.repository.save(order);
        }
    }
    public void updateOrderStatusCanceled(KafkaPaymentDTO kafkaPaymentDTO) {
        Order order = this.repository.findByTransactionId(kafkaPaymentDTO.getData().getTransactionId())
                .orElseThrow(() -> new RecordNotFoundException("Order not found by transaction id "+kafkaPaymentDTO.getData().getTransactionId()));
        if(kafkaPaymentDTO.getEvent().equalsIgnoreCase("payment-invalid")){
            order.setOrderStatus("CANCELED");
            order.setStatement((kafkaPaymentDTO.getData().getStatement()));
            this.repository.save(order);
        }
    }
}
