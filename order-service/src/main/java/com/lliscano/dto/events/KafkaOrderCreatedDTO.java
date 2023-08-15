package com.lliscano.dto.events;

import com.lliscano.dto.OrderDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KafkaOrderCreatedDTO {
    private String event = "order-created";
    private OrderDTO data;
}
