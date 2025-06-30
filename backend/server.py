from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import requests
import logging
import os

# Bypass proxy for localhost
os.environ['NO_PROXY'] = 'localhost,127.0.0.1'

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# LLM API configuration
LLM_API_URL = "http://localhost:11434/api/generate"

def get_llm_explanation(system_name, inputs, outputs):
    """Get explanation from LLM API"""
    try:
        prompt = f"""
You are a helpful assistant. A user has input the following values for a {system_name} scenario:

Inputs:
{inputs}

And the system computed:
{outputs}

Please explain in simple terms what these results mean, step-by-step, in the context of wireless systems.
"""
        
        payload = {
            "model": "gemma3:27b",
            "prompt": prompt,
            "images": [],
            "stream": False
        }
        
        response = requests.post(LLM_API_URL, json=payload)
        response.raise_for_status()
        
        result = response.json()
        return result.get('response', 'Explanation generation failed.')
        
    except Exception as e:
        logger.error(f"LLM API error: {str(e)}")
        return f"⚠️ LLM explanation failed: {str(e)}"

@app.route('/api/wireless', methods=['POST'])
def wireless_calculation():
    """Calculate wireless communication system rates"""
    try:
        data = request.get_json()
        
        # Extract parameters
        bandwidth_hz = float(data['bandwidth_hz'])
        quantizer_bits = int(data['quantizer_bits'])
        source_encoder_rate = float(data['source_encoder_rate'])
        channel_encoder_rate = float(data['channel_encoder_rate'])
        burst_overhead_percent = float(data['burst_overhead_percent'])
        
        # Validate inputs
        if channel_encoder_rate == 0:
            return jsonify({'error': 'Channel encoder rate must not be zero'}), 400
        
        # Calculations
        sampler_rate = 2 * bandwidth_hz
        quantizer_rate = sampler_rate * quantizer_bits
        source_encoded_rate = quantizer_rate * source_encoder_rate
        channel_encoded_rate = source_encoded_rate / channel_encoder_rate
        
        # Placeholders for fields not calculated in original
        interleaver_rate = 0.0
        burst_format_rate = 0.0
        
        results = {
            "sampler_rate": round(sampler_rate, 3),
            "quantizer_rate": round(quantizer_rate, 3),
            "source_encoder_rate": round(source_encoded_rate, 3),
            "channel_encoder_rate": round(channel_encoded_rate, 3),
            "interleaver_rate": interleaver_rate,
            "burst_format_rate": burst_format_rate
        }
        
        # Get LLM explanation
        explanation = get_llm_explanation("Wireless Communication System", data, results)
        results["explanation"] = explanation
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Wireless calculation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ofdm', methods=['POST'])
def ofdm_calculation():
    """Calculate OFDM system rates"""
    try:
        data = request.get_json()
        
        # Extract parameters
        modulation_order = int(data['modulation_order'])
        coding_rate = float(data['coding_rate'])
        subcarriers = int(data['subcarriers'])
        symbols_per_slot = int(data['symbols_per_slot'])
        num_resource_blocks = int(data['num_resource_blocks'])
        bandwidth_hz = float(data['bandwidth_hz'])
        
        # Validate inputs
        if modulation_order <= 1:
            return jsonify({'error': 'Modulation order must be greater than 1'}), 400
        if bandwidth_hz <= 0:
            return jsonify({'error': 'Bandwidth must be greater than 0'}), 400
        
        # Calculations
        bits_per_symbol = math.log2(modulation_order)
        rate_per_re = bits_per_symbol * coding_rate
        rate_per_ofdm_symbol = rate_per_re * subcarriers
        rate_per_rb = rate_per_ofdm_symbol * symbols_per_slot
        max_capacity = rate_per_rb * num_resource_blocks
        spectral_efficiency = max_capacity / bandwidth_hz
        
        results = {
            "rate_per_resource_element_bps": round(rate_per_re, 3),
            "rate_per_ofdm_symbol_bps": round(rate_per_ofdm_symbol, 3),
            "rate_per_resource_block_bps": round(rate_per_rb, 3),
            "max_transmission_capacity_bps": round(max_capacity, 3),
            "spectral_efficiency_bps_per_hz": round(spectral_efficiency, 6)
        }
        
        # Get LLM explanation
        explanation = get_llm_explanation("OFDM System", data, results)
        results["explanation"] = explanation
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"OFDM calculation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/link-budget', methods=['POST'])
def link_budget_calculation():
    """Calculate link budget"""
    try:
        data = request.get_json()
        
        # Extract parameters
        tx_power_dbm = float(data['tx_power_dbm'])
        tx_gain_dbi = float(data['tx_gain_dbi'])
        rx_gain_dbi = float(data['rx_gain_dbi'])
        frequency_mhz = float(data['frequency_mhz'])
        distance_km = float(data['distance_km'])
        misc_losses_db = float(data.get('misc_losses_db', 0.0))
        
        # Validate inputs
        if distance_km <= 0 or frequency_mhz <= 0:
            return jsonify({'error': 'Distance and frequency must be greater than 0'}), 400
        
        # Calculations
        # Free Space Path Loss (FSPL)
        fspl = 20 * math.log10(distance_km) + 20 * math.log10(frequency_mhz) + 32.44
        received_power = tx_power_dbm + tx_gain_dbi + rx_gain_dbi - fspl - misc_losses_db
        eirp = tx_power_dbm + tx_gain_dbi
        
        results = {
            "effective_isotropic_radiated_power_dbm": round(eirp, 3),
            "received_power_dbm": round(received_power, 3)
        }
        
        # Get LLM explanation
        explanation = get_llm_explanation("Link Budget Calculation", data, results)
        results["explanation"] = explanation
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Link budget calculation error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/cellular', methods=['POST'])
def cellular_calculation():
    """Calculate cellular network design"""
    try:
        data = request.get_json()
        
        # Extract parameters
        coverage_area = float(data['coverage_area'])
        population_density = float(data['population_density'])
        user_data_rate = float(data['user_data_rate'])
        frequency_band = float(data['frequency_band'])
        terrain_type = str(data['terrain_type']).lower()
        
        # Validate inputs
        if coverage_area <= 0:
            return jsonify({'error': 'Coverage area must be greater than 0'}), 400
        if population_density <= 0:
            return jsonify({'error': 'Population density must be greater than 0'}), 400
        if user_data_rate <= 0:
            return jsonify({'error': 'User data rate must be greater than 0'}), 400
        if frequency_band <= 0:
            return jsonify({'error': 'Frequency band must be greater than 0'}), 400
        if terrain_type not in ['urban', 'suburban', 'dense_urban', 'rural']:
            return jsonify({'error': 'Invalid terrain type. Must be urban, suburban, dense_urban, or rural'}), 400
        
        # Calculations
        total_users = coverage_area * population_density
        total_capacity = total_users * user_data_rate
        
        # Determine cell radius based on frequency and terrain
        if frequency_band < 1000:  # Low frequency (< 1 GHz)
            if terrain_type == 'dense_urban':
                cell_radius = 0.8
            elif terrain_type == 'urban':
                cell_radius = 1.5
            elif terrain_type == 'suburban':
                cell_radius = 3.0
            else:  # rural
                cell_radius = 8.0
        elif frequency_band < 6000:  # Mid frequency (1-6 GHz)
            if terrain_type == 'dense_urban':
                cell_radius = 0.4
            elif terrain_type == 'urban':
                cell_radius = 0.8
            elif terrain_type == 'suburban':
                cell_radius = 1.5
            else:  # rural
                cell_radius = 4.0
        else:  # High frequency (> 6 GHz)
            if terrain_type == 'dense_urban':
                cell_radius = 0.1
            elif terrain_type == 'urban':
                cell_radius = 0.2
            elif terrain_type == 'suburban':
                cell_radius = 0.5
            else:  # rural
                cell_radius = 1.0
        
        # Calculate number of cells needed
        cell_area = math.pi * cell_radius * cell_radius
        cells_needed = math.ceil(coverage_area / cell_area)
        
        # Calculate additional metrics
        users_per_cell = total_users / cells_needed if cells_needed > 0 else 0
        capacity_per_cell = total_capacity / cells_needed if cells_needed > 0 else 0
        
        results = {
            "total_users": int(total_users),
            "total_capacity": round(total_capacity, 2),
            "cell_radius": round(cell_radius, 2),
            "cells_needed": cells_needed,
            "frequency_band": frequency_band,
            "users_per_cell": round(users_per_cell, 1),
            "capacity_per_cell": round(capacity_per_cell, 2)
        }
        
        # Get LLM explanation
        explanation = get_llm_explanation("Cellular Network Design", data, results)
        results["explanation"] = explanation
        
        return jsonify(results)
        
    except KeyError as e:
        return jsonify({'error': f'Missing required parameter: {str(e)}'}), 400
    except ValueError as e:
        return jsonify({'error': f'Invalid parameter value: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Calculation failed: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Flask backend is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=7111)
