package com.lliscano.consumer;

import com.lliscano.dto.events.KafkaPaymentDTO;
import com.lliscano.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class KafkaConsumer {
    private static final String TOPIC_PAYMENT_CREATED = "payment-created-topic";
    private static final String TOPIC_PAYMENT_INVALID = "payment-invalid-topic";
    private static final String GROUP = "payment-event-group";

    private final OrderService service;

    @KafkaListener(topics = TOPIC_PAYMENT_CREATED, groupId = GROUP)
    public void listenerPaymentCreatedEvents(KafkaPaymentDTO kafkaPaymentDTO) {
        this.service.updateOrderStatusCompleted(kafkaPaymentDTO);
    }

    @KafkaListener(topics = TOPIC_PAYMENT_INVALID, groupId = GROUP)
    public void listenerPaymentInvalidEvents(KafkaPaymentDTO kafkaPaymentDTO) {
        this.service.updateOrderStatusCanceled(kafkaPaymentDTO);
    }
}
