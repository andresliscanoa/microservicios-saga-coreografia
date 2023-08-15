package com.lliscano.dto.events;

import com.lliscano.dto.PaymentDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KafkaPaymentDTO {
    private String event;
    private PaymentDTO data;
}
