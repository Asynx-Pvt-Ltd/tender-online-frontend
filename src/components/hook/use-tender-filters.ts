'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const districts = [
	'Ariyalur',
	'Chengalpattu',
	'Chennai',
	'Coimbatore',
	'Cuddalore',
	'Dharmapuri',
	'Dindigul',
	'Erode',
	'Kallakurichi',
	'Kancheepuram',
	'Kanniyakumari',
	'Karur',
	'Krishnagiri',
	'Madurai',
	'Mayiladuthurai',
	'Nagapattinam',
	'Namakkal',
	'Nilgiris',
	'Perambalur',
	'Pudukkottai',
	'Ramanathapuram',
	'Ranipet',
	'Salem',
	'Sivaganga',
	'Tenkasi',
	'Thanjavur',
	'Theni',
	'Thoothukudi',
	'Tiruchirappalli',
	'Tirunelveli',
	'Tirupattur',
	'Tiruppur',
	'Tiruvallur',
	'Tiruvannamalai',
	'Tiruvarur',
	'Vellore',
	'Viluppuram',
	'Virudhunagar',
];

const departments = [
	'Agriculture Department',
	'Animal Husbandry Department',
	'BC, MBC & Minorities Welfare Department',
	'Commercial Taxes and Registration Department',
	'Co-operation, Food and Consumer Protection Department',
	'Energy Department',
	'Environment and Forests Department',
	'Finance Department',
	'Handlooms, Handicrafts, Textiles and Khadi Department',
	'Health and Family Welfare Department',
	'Higher Education Department',
	'Highways and Minor Ports Department',
	'Home, Prohibition and Excise Department',
	'Housing and Urban Development Department',
	'Industries Department',
	'Information Technology Department',
	'Labour Welfare and Skill Development Department',
	'Law Department',
	'Municipal Administration and Water Supply Department',
	'Planning, Development and Special Initiatives Department',
	'Public Department',
	'Public Works Department',
	'Revenue and Disaster Management Department',
	'Rural Development and Panchayat Raj Department',
	'School Education Department',
	'Social Welfare and Women Empowerment Department',
	'Tamil Development and Information Department',
	'Tourism, Culture and Religious Endowments Department',
	'Transport Department',
	'Youth Welfare and Sports Development Department',
];

export const industriesData = [
	{
		value: 'construction',
		label: 'Construction',
		subIndustries: [
			{
				value: 'building-maintenance-repair-services',
				label: 'Building Maintenance & Repair Services',
			},
			{
				value: 'building-repair-maintenance',
				label: 'Building Repair & Maintenance',
			},
			{
				value: 'educational-facilities-construction',
				label: 'Educational Facilities Construction',
			},
		],
	},
	{
		value: 'education',
		label: 'Education',
		subIndustries: [
			{
				value: 'educational-services',
				label: 'Educational Services',
			},
			{
				value: 'administrative-support-services',
				label: 'Administrative and Support Services',
			},
			{
				value: 'educational-goods',
				label: 'Educational Goods',
			},
			{
				value: 'educational-institutions',
				label: 'Educational Institutions',
			},
			{
				value: 'educational-support-services',
				label: 'Educational Support Services',
			},
			{
				value: 'educational-supplies',
				label: 'Educational Supplies',
			},
			{
				value: 'literature-and-publishing',
				label: 'Literature and Publishing',
			},
			{
				value: 'education-and-training',
				label: 'Education and Training',
			},
			{
				value: 'postsecondary-educational-services',
				label:
					'Educational Institutions and Educational Services - Postsecondary',
			},
			{
				value: 'nec-educational-services',
				label:
					'Educational Institutions and Services NEC (Not Elsewhere Classified)',
			},
			{
				value: 'library-services',
				label: 'Library Services',
			},
			{
				value: 'preschool-education',
				label: 'Educational Institutions and Preschools',
			},
			{
				value: 'vocational-education',
				label: 'Vocational Education and Training',
			},
			{
				value: 'training-services',
				label: 'Training and Education Services',
			},
			{
				value: 'universities-colleges',
				label: 'Educational Institutions (Universities, Colleges, etc.)',
			},
		],
	},
	{
		value: 'consumer-goods',
		label: 'Consumer Goods',
		subIndustries: [
			{
				value: 'personal-care-products',
				label: 'Personal Care Products',
			},
			{
				value: 'consumer-discretionary',
				label: 'Consumer Discretionary Goods',
			},
			{
				value: 'personal-care-household-goods',
				label: 'Personal Care & Household Goods',
			},
			{
				value: 'musical-instruments',
				label: 'Musical Instruments',
			},
			{
				value: 'jewelry-precious-metals',
				label: 'Jewelry and Precious Metals',
			},
			{
				value: 'fruits-vegetables',
				label: 'Fruits and Vegetables',
			},
			{
				value: 'household-personal-products',
				label: 'Household and Personal Products',
			},
			{
				value: 'retail-consumer-goods',
				label: 'Retail Consumer Goods',
			},
			{
				value: 'household-personal-care-products',
				label: 'Household & Personal Care Products',
			},
			{
				value: 'grocery-food-stores',
				label: 'Grocery and Other Food Stores',
			},
			{
				value: 'dairy-products',
				label: 'Dairy Products',
			},
		],
	},
	{
		value: 'hardware',
		label: 'Hardware',
		subIndustries: [
			{
				value: 'hardware-stores',
				label: 'Hardware Stores',
			},
			{
				value: 'fasteners-bolting-materials',
				label: 'Fasteners and Bolting Materials',
			},
			{
				value: 'hardware-plumbing-supplies',
				label: 'Hardware and Plumbing Supplies',
			},
			{
				value: 'fasteners-hardware',
				label: 'Fasteners and Hardware',
			},
		],
	},
	{
		value: 'manufacturing',
		label: 'Manufacturing',
		subIndustries: [
			{
				value: 'manufacturing-industry',
				label: 'Manufacturing Industry',
			},
			{
				value: 'manufacturing-goods',
				label: 'Manufacturing Goods',
			},
			{
				value: 'manufacturing-services',
				label: 'Manufacturing Services',
			},
			{
				value: 'sign-manufacturing',
				label: 'Sign Manufacturing',
			},
			{
				value: 'tableware-glassware-manufacturing',
				label: 'Tableware and Glassware Manufacturing',
			},
			{
				value: 'semiconductor-manufacturing',
				label: 'Semiconductor Manufacturing',
			},
			{
				value: 'miscellaneous-manufacturing',
				label: 'Miscellaneous Manufacturing Industries',
			},
			{
				value: 'interior-goods-manufacturing',
				label: 'Interior Goods Manufacturing',
			},
			{
				value: 'machinery-manufacturing',
				label: 'Machinery Manufacturing',
			},
			{
				value: 'heating-equipment-supplies',
				label: 'Heating Equipment and Supplies',
			},
			{
				value: 'construction-equipment-machinery',
				label: 'Construction Equipment & Machinery',
			},
			{
				value: 'machinery-equipment-manufacturing',
				label: 'Machinery and Equipment Manufacturing',
			},
		],
	},
	{
		value: 'telecommunications',
		label: 'Telecommunications',
		subIndustries: [
			{
				value: 'social-infrastructure',
				label: 'Social Infrastructure',
			},
			{
				value: 'social-services',
				label: 'Social Services',
			},
			{
				value: 'community-social-services',
				label: 'Community and Social Services',
			},
			{
				value: 'telecommunications-services',
				label: 'Telecommunications Services',
			},
			{
				value: 'community-social-personal-services',
				label: 'Community, Social & Personal Services',
			},
			{
				value: 'telecommunications-equipment',
				label: 'Telecommunications Equipment',
			},
			{
				value: 'telecommunications-industry',
				label: 'Telecommunications Industry',
			},
			{
				value: 'political-social-services',
				label: 'Political and Social Services',
			},
			{
				value: 'ict',
				label: 'ICT (Information and Communication Technology)',
			},
			{
				value: 'ict-industry',
				label: 'ICT Industry',
			},
			{
				value: 'ict-services',
				label: 'ICT Services',
			},
			{
				value: 'communication-equipment',
				label: 'Communication Equipment',
			},
			{
				value: 'telecommunications-infrastructure',
				label: 'Telecommunications Infrastructure',
			},
			{
				value: 'communication-services',
				label: 'Communication Services',
			},
			{
				value: 'communications-equipment-services',
				label: 'Communication Equipment & Services',
			},
			{
				value: 'broadcasting-cable-tv',
				label: 'Broadcasting & Cable TV',
			},
			{
				value: 'media-broadcasting',
				label: 'Media and Broadcasting',
			},
			{
				value: 'information-communication',
				label: 'Information and Communication',
			},
		],
	},
	{
		value: 'chemical-industry',
		label: 'Chemical Industry',
		subIndustries: [
			{
				value: 'chemical-goods',
				label: 'Chemical Goods',
			},
			{
				value: 'chemicals',
				label: 'Chemicals',
			},
			{
				value: 'chemical-manufacturing',
				label: 'Chemical Manufacturing',
			},
			{
				value: 'chemicals-allied-products',
				label: 'Chemicals and Allied Products',
			},
			{
				value: 'alcoholic-beverages',
				label: 'Alcoholic Beverages',
			},
			{
				value: 'chemical-industries',
				label: 'Chemical Industries',
			},
			{
				value: 'specialty-chemicals',
				label: 'Specialty Chemicals',
			},
			{
				value: 'chemicals-industry',
				label: 'Chemicals Industry',
			},
			{
				value: 'chemical-plastics-products',
				label: 'Chemical and Plastics Products',
			},
			{
				value: 'chemical',
				label: 'Chemical',
			},
		],
	},
	{
		value: 'paper-pulp-industry',
		label: 'Paper & Pulp Industry',
		subIndustries: [
			{
				value: 'paper-and-paper-products',
				label: 'Paper and Paper Products',
			},
			{
				value: 'packaging-industry',
				label: 'Packaging Industry',
			},
			{
				value: 'paper-and-allied-products-industry',
				label: 'Paper and Allied Products Industry',
			},
			{
				value: 'paper-products',
				label: 'Paper Products',
			},
			{
				value: 'paper-industry',
				label: 'Paper Industry',
			},
			{
				value: 'packaging-materials',
				label: 'Packaging Materials',
			},
			{
				value: 'paper-goods',
				label: 'Paper Goods',
			},
			{
				value: 'paper-manufacturing',
				label: 'Paper Manufacturing',
			},
			{
				value: 'paper-and-paper-products-industry',
				label: 'Paper and Paper Products Industry',
			},
			{
				value: 'paper-pulp',
				label: 'Paper & Pulp',
			},
		],
	},
	{
		value: 'information-technology-industry',
		label: 'Information Technology Industry',
		subIndustries: [
			{
				value: 'information-technology-services',
				label: 'Information Technology Services',
			},
			{
				value: 'information-technology',
				label: 'Information Technology',
			},
			{
				value: 'information-technology-and-services',
				label: 'Information Technology and Services',
			},
			{
				value: 'information-technology-services',
				label: 'Information Technology & Services',
			},
			{
				value: 'technology-services',
				label: 'Technology Services',
			},
			{
				value: 'technological-goods',
				label: 'Technological Goods',
			},
			{
				value: 'technology',
				label: 'Technology',
			},
			{
				value: 'it-telecommunications',
				label: 'I.T. & Telecommunications',
			},
			{
				value: 'it-services',
				label: 'IT Services',
			},
			{
				value: 'software-industry',
				label: 'Software Industry',
			},
			{
				value: 'information-technology-and-telecommunications',
				label: 'Information Technology and Telecommunications',
			},
			{
				value: 'information-technology-and-business-services',
				label: 'Information Technology and Business Services',
			},
			{
				value: 'technology-and-telecommunications',
				label: 'Technology and Telecommunications',
			},
			{
				value: 'technological-services',
				label: 'Technological Services',
			},
			{
				value: 'technology-communication-services',
				label: 'Technology & Communication Services',
			},
			{
				value: 'software-it-services',
				label: 'Software and IT Services',
			},
			{
				value: 'software-development',
				label: 'Software Development',
			},
			{
				value: 'information-technology-enabled-services',
				label: 'Information Technology Enabled Services (ITES)',
			},
			{
				value: 'it-communication-technology',
				label: 'I.T. & Communication Technology',
			},
			{
				value: 'it-telecommunication-goods',
				label: 'I.T. & Telecommunication Goods',
			},
			{
				value: 'i-technology-services',
				label: 'I. Technology Services',
			},
			{
				value: 'information-technology-business-services',
				label: 'Information Technology and Business Services',
			},
			{
				value: 'software-information-technology-services',
				label: 'Software and Information Technology Services',
			},
			{
				value: 'information-technology-services',
				label: 'Information Technology (IT) Services',
			},
			{
				value: 'i-information-technology-services',
				label: 'I. Information Technology and Services',
			},
			{
				value: 'software-information-technology-services',
				label: 'Software & Information Technology Services',
			},
			{
				value: 'information-technology-telecommunications-goods',
				label: 'Information Technology & Telecommunications Goods',
			},
			{
				value: 'information-technology',
				label: 'Information Technology',
			},
		],
	},
	{
		value: 'mining-industry',
		label: 'Mining Industry',
		subIndustries: [
			{
				value: 'mining-industry',
				label: 'Mining Industry',
			},
			{
				value: 'metals-and-minerals',
				label: 'Metals and Minerals',
			},
			{
				value: 'mining',
				label: 'Mining',
			},
			{
				value: 'mining-and-quarrying',
				label: 'Mining and Quarrying',
			},
			{
				value: 'metals-and-mining',
				label: 'Metals and Mining',
			},
			{
				value: 'metals-and-minerals-processing',
				label: 'Metals and Minerals Processing',
			},
			{
				value: 'mineral-metal-products',
				label: 'Mineral & Metal Products',
			},
			{
				value: 'mineral-processing',
				label: 'Mineral Processing',
			},
			{
				value: 'mining-operations',
				label: 'Mining Operations',
			},
			{
				value: 'metals-and-minerals-processing-industry',
				label: 'Metals and Minerals Processing Industry',
			},
			{
				value: 'stone-quarrying-and-processing',
				label: 'Stone Quarrying and Processing',
			},
		],
	},
	{
		value: 'transportation-industry',
		label: 'Transportation Industry',
		subIndustries: [
			{
				value: 'transportation-services',
				label: 'Transportation Services',
			},
			{
				value: 'transportation',
				label: 'Transportation',
			},
			{
				value: 'logistics-and-transportation',
				label: 'Logistics and Transportation',
			},
			{
				value: 'transportation-logistics',
				label: 'Transportation & Logistics',
			},
			{
				value: 'transportation-infrastructure',
				label: 'Transportation Infrastructure',
			},
			{
				value: 'transportation-of-goods',
				label: 'Transportation of Goods',
			},
			{
				value: 'transportation-equipment',
				label: 'Transportation Equipment',
			},
			{
				value: 'logistics-and-supply-chain-management',
				label: 'Logistics and Supply Chain Management',
			},
			{
				value: 'rail-transportation',
				label: 'Rail Transportation',
			},
			{
				value: 'transportation-goods',
				label: 'Transportation Goods',
			},
			{
				value: 'postal-and-courier-services',
				label: 'Postal and Courier Services',
			},
			{
				value: 'transportation-industry',
				label: 'Transportation Industry',
			},
			{
				value: 'logistics-and-transportation-services',
				label: 'Logistics and Transportation Services',
			},
			{
				value: 'transportation-and-storage',
				label: 'Transportation and Storage',
			},
			{
				value: 'commercial-vehicles',
				label: 'Commercial Vehicles',
			},
			{
				value: 'transportation-and-warehousing',
				label: 'Transportation and Warehousing',
			},
			{
				value: 'logistics-services',
				label: 'Logistics Services',
			},
			{
				value: 'railway-transportation',
				label: 'Railway Transportation',
			},
			{
				value: 'logistics-and-warehousing',
				label: 'Logistics and Warehousing',
			},
			{
				value: 'transportation-warehousing',
				label: 'Transportation & Warehousing',
			},
			{
				value: 'postal-and-shipping-services',
				label: 'Postal and Shipping Services',
			},
			{
				value: 'postal-and-logistics-services',
				label: 'Postal and Logistics Services',
			},
			{
				value: 'transportation-and-logistics-services',
				label: 'Transportation and Logistics Services',
			},
			{
				value: 'tourism',
				label: 'Tourism',
			},
			{
				value: 'transportation-and-logistics-industry',
				label: 'Industry: Transportation and Logistics',
			},
			{
				value: 'logistics',
				label: 'Logistics',
			},
			{
				value: 'tourism-and-travel-services',
				label: 'Tourism and Travel Services',
			},
			{
				value: 'transportation-equipment-rental-and-leasing',
				label: 'Transportation Equipment Rental and Leasing',
			},
			{
				value: 'rail-transport',
				label: 'Rail Transport',
			},
			{
				value: 'postal-services',
				label: 'Postal Services',
			},
			{
				value: 'transportation-equipment-and-supplies',
				label: 'Transportation Equipment and Supplies',
			},
			{
				value: 'tourism-services',
				label: 'Tourism Services',
			},
			{
				value: 'logistics-and-transportation',
				label: 'Logistics and Transportation',
			},
			{
				value: 'maritime-transport-and-logistics',
				label: 'Maritime Transport and Logistics',
			},
			{
				value: 'couriers-express-delivery-postal-services',
				label: 'Couriers, Express Delivery, and Postal Services',
			},
			{
				value: 'transportation-and-logistics',
				label: 'Transportation and Logistics',
			},
			{
				value: 'ports-and-terminals',
				label: 'Ports and Terminals',
			},
			{
				value: 'logistics-and-supply-chain-management',
				label: 'Logistics and Supply Chain Management',
			},
			{
				value: 'warehousing-and-storage',
				label: 'Warehousing and Storage',
			},
		],
	},
	{
		value: 'water-supply-waste-management-industry',
		label: 'Water Supply and Waste Management',
		subIndustries: [
			{
				value: 'water-treatment-and-supply',
				label: 'Water Treatment and Supply',
			},
			{
				value: 'water-treatment-and-distribution',
				label: 'Water Treatment and Distribution',
			},
			{
				value: 'water-treatment-and-waste-management',
				label: 'Water Treatment and Waste Management',
			},
			{
				value: 'water-and-wastewater-services',
				label: 'Water and Wastewater Services',
			},
			{
				value: 'water-resources-industry',
				label: 'Water Resources Industry',
			},
			{
				value: 'water-supply-and-wastewater',
				label: 'Water Supply and Wastewater',
			},
			{
				value: 'water-and-wastewater-management',
				label: 'Water and Wastewater Management',
			},
			{
				value: 'water-treatment-and-wastewater-management',
				label: 'Water Treatment and Wastewater Management',
			},
			{
				value: 'water-resources',
				label: 'Water Resources',
			},
			{
				value: 'water-supply-industry',
				label: 'Water Supply Industry',
			},
			{
				value: 'water-works',
				label: 'Water Works',
			},
			{
				value: 'energy-and-utilities',
				label: 'Energy and Utilities',
			},
			{
				value: 'public-utilities-and-services',
				label: 'Public Utilities and Services',
			},
			{
				value: 'utilities-and-infrastructure',
				label: 'Utilities and Infrastructure',
			},
			{
				value: 'water-and-wastewater',
				label: 'Water and Wastewater',
			},
			{
				value: 'wetlands-and-watercourses',
				label: 'Wetlands and Watercourses',
			},
			{
				value: 'industry-water-and-wastewater',
				label: 'Industry: Water and Wastewater',
			},
			{
				value: 'industry-utilities-and-energy',
				label: 'Industry: Utilities and Energy',
			},
			{
				value: 'industry-water-supply',
				label: 'Industry: Water Supply',
			},
			{
				value: 'water-and-wastewater-system-operators',
				label:
					'Water and Wastewater System Operators and Waste Treatment Plant Operators',
			},
			{
				value: 'water-and-wastewater-treatment-and-distribution',
				label: 'Water and Wastewater Treatment and Distribution',
			},
			{
				value: 'water-and-wastewater-treatment-services',
				label: 'Water and Wastewater Treatment Services',
			},
			{
				value: 'water-supply-wastewater-treatment',
				label: 'Water Supply & Wastewater Treatment',
			},
			{
				value: 'water-supply',
				label: 'Water Supply',
			},
			{
				value: 'utilities',
				label: 'Utilities',
			},
		],
	},
	{
		value: 'building-construction-industry',
		label: 'Building Construction',
		subIndustries: [
			{
				value: 'municipal-public-services',
				label: 'Municipal & Public Services',
			},
			{
				value: 'civil-works',
				label: 'Civil Works',
			},
			{
				value: 'infrastructure-works',
				label: 'Infrastructure Works',
			},
			{
				value: 'building-and-construction',
				label: 'Building and Construction',
			},
			{
				value: 'building-construction',
				label: 'Building Construction',
			},
			{
				value: 'urban-development-and-construction',
				label: 'Urban Development and Construction',
			},
			{
				value: 'engineering-services',
				label: 'Engineering Services',
			},
			{
				value: 'commercial-construction',
				label: 'Commercial Construction',
			},
			{
				value: 'construction-materials-and-equipment',
				label: 'Construction Materials and Equipment',
			},
			{
				value: 'housing-and-construction',
				label: 'Housing and Construction',
			},
			{
				value: 'water-well-drilling-and-construction',
				label: 'Water Well Drilling and Construction',
			},
			{
				value: 'real-estate-and-construction',
				label: 'Real Estate & Construction',
			},
			{
				value: 'infrastructure-and-construction',
				label: 'Infrastructure & Construction',
			},
			{
				value: 'construction-works',
				label: 'Construction Works',
			},
			{
				value: 'civil-engineering',
				label: 'Civil Engineering',
			},
			{
				value: 'commercial-and-institutional-building-construction',
				label: 'Commercial and Institutional Building Construction',
			},
			{
				value: 'structural-construction',
				label: 'Structural Construction',
			},
			{
				value: 'municipal-public-works',
				label: 'Municipal & Public Works',
			},
			{
				value: 'road-and-bridge-construction',
				label: 'Road and Bridge Construction',
			},
			{
				value: 'civil-maintenance',
				label: 'Civil Maintenance',
			},
			{
				value: 'building-and-facility-services',
				label: 'Building and Facility Services',
			},
			{
				value: 'construction-services',
				label: 'Construction Services',
			},
			{
				value: 'residential-and-institutional-buildings',
				label: 'Residential and Institutional Buildings',
			},
			{
				value: 'residential-and-business-services',
				label: 'Residential and Business Services',
			},
			{
				value: 'monument-construction',
				label: 'Monument Construction',
			},
			{
				value: 'industrial-buildings',
				label: 'Industrial Buildings',
			},
			{
				value: 'industrial-construction',
				label: 'Industrial Construction',
			},
			{
				value: 'heavy-construction',
				label: 'Heavy Construction',
			},
			{
				value: 'civic-community-services',
				label: 'Civic & Community Services',
			},
			{
				value: 'commercial-and-residential-services',
				label: 'Commercial and Residential Services',
			},
			{
				value: 'civic-works',
				label: 'Civic Works',
			},
			{
				value: 'civil-engineering-services',
				label: 'Civil Engineering Services',
			},
			{
				value: 'civil-infrastructure-maintenance',
				label: 'Civil Infrastructure Maintenance',
			},
			{
				value: 'heavy-civil-construction',
				label: 'Heavy Civil Construction',
			},
			{
				value: 'school-construction',
				label: 'School Construction',
			},
			{
				value: 'construction-materials',
				label: 'Construction Materials',
			},
			{
				value: 'real-estate-and-construction',
				label: 'Real Estate and Construction',
			},
			{
				value: 'housing',
				label: 'Housing',
			},
			{
				value: 'public-works',
				label: 'Public Works',
			},
			{
				value: 'public-services',
				label: 'Public Services',
			},
			{
				value: 'housing-and-residential',
				label: 'Housing and Residential',
			},
			{
				value: 'community-development',
				label: 'Community Development',
			},
			{
				value: 'rural-development',
				label: 'Rural Development',
			},
			{
				value: 'community-development-social-services',
				label: 'Community Development & Social Services',
			},
			{
				value: 'infrastructure-development',
				label: 'Infrastructure Development',
			},
			{
				value: 'construction-equipment-rental-and-leasing',
				label: 'Construction Equipment Rental and Leasing',
			},
			{
				value: 'building-materials-and-equipment',
				label: 'Building Materials and Equipment',
			},
			{
				value: 'urban-development-and-housing',
				label: 'Urban Development and Housing',
			},
			{
				value: 'rural-infrastructure',
				label: 'Rural Infrastructure',
			},
			{
				value: 'city-and-urban-development',
				label: 'City and Urban Development',
			},
			{
				value: 'building-and-construction-materials',
				label: 'Building and Construction Materials',
			},
			{
				value: 'building-products-equipment',
				label: 'Building Products & Equipment',
			},
			{
				value: 'public-works-and-services',
				label: 'Public Works and Services',
			},
			{
				value: 'public-infrastructure-development-in-agricultural-areas',
				label: 'Public Infrastructure Development in Agricultural Areas',
			},
			{
				value: 'building-maintenance-and-repair',
				label: 'Building Maintenance and Repair',
			},
			{
				value: 'urban-development-and-municipal-services',
				label: 'Urban Development and Municipal Services',
			},
			{
				value: 'housing-and-residential-buildings',
				label: 'Housing and Residential Buildings',
			},
			{
				value: 'demolition-and-dismantling',
				label: 'Demolition and Dismantling',
			},
			{
				value: 'fencing-materials',
				label: 'Fencing Materials',
			},
			{
				value: 'engineering-construction',
				label: 'Engineering Construction',
			},
			{
				value: 'construction-equipment-and-machinery',
				label: 'Construction Equipment and Machinery',
			},
			{
				value: 'commercial-and-residential-construction',
				label: 'Commercial and Residential Construction',
			},
			{
				value: 'building-maintenance',
				label: 'Building Maintenance',
			},
			{
				value: 'building-materials-and-construction',
				label: 'Building Materials and Construction',
			},
			{
				value: 'construction-real-estate',
				label: 'Construction & Real Estate',
			},
			{
				value: 'commercial-and-industrial-buildings',
				label: 'Commercial and Industrial Buildings',
			},
			{
				value: 'commercial-and-institutional-buildings',
				label: 'Commercial and Institutional Buildings',
			},
			{
				value: 'building-services-and-maintenance',
				label: 'Building Services and Maintenance',
			},
			{
				value: 'public-works-and-utilities',
				label: 'Public Works and Utilities',
			},
			{
				value: 'building-and-property-services',
				label: 'Building and Property Services',
			},
			{
				value: 'building-construction-and-allied-activities',
				label: 'Building Construction and Allied Activities',
			},
			{
				value: 'administrative-buildings-and-facilities',
				label: 'Administrative Buildings and Facilities',
			},
			{
				value: 'building-construction-other-special-trade-contractors',
				label: 'Building Construction, Other Special Trade Contractors',
			},
			{
				value: 'urban-infrastructure',
				label: 'Urban Infrastructure',
			},
			{
				value: 'urban-planning-and-development',
				label: 'Urban Planning and Development',
			},
			{
				value: 'interior-design-and-construction',
				label: 'Interior Design and Construction',
			},
			{
				value: 'cemetery-and-funeral-services',
				label: 'Cemetery and Funeral Services',
			},
			{
				value: 'cemeteries-and-funeral-homes',
				label: 'Cemeteries and Funeral Homes',
			},
			{
				value: 'infrastructure-industry',
				label: 'Infrastructure Industry',
			},
			{
				value: 'green-spaces-and-parks',
				label: 'Green Spaces and Parks',
			},
			{
				value: 'funerals-and-cemeteries',
				label: 'Funerals and Cemeteries',
			},
			{
				value: 'monument-restoration-and-preservation',
				label: 'Monument Restoration and Preservation',
			},
			{
				value: 'community-centers',
				label: 'Community Centers',
			},
			{
				value: 'public-administration',
				label: 'Public Administration',
			},
			{
				value: 'industry-public-administration',
				label: 'Industry: Public Administration',
			},
			{
				value: 'office-administration',
				label: 'Office Administration',
			},
			{
				value: 'law-enforcement',
				label: 'Law Enforcement',
			},
			{
				value: 'public-administration-and-defense',
				label: 'Public Administration and Defense',
			},
			{
				value: 'public-administration-and-safety',
				label: 'Public Administration and Safety',
			},
			{
				value: 'cooperatives',
				label: 'Cooperatives',
			},
			{
				value: 'electricity-gas-water',
				label: 'Electricity, Gas, Water Supply and Other Utilities',
			},
			{
				value: 'municipal-services',
				label: 'Municipal Services',
			},
			{
				value: 'municipal-parastatal-public-service-provision',
				label: 'Municipal, Parastatal and Public Service Provision',
			},
			{
				value: 'repair-services',
				label: 'Repair Services',
			},
			{
				value: 'housing-and-community-amenities',
				label: 'Housing and Community Amenities',
			},
			{
				value: 'housing-and-community-development',
				label: 'Housing and Community Development',
			},
			{
				value: 'commercial-and-industrial-services',
				label: 'Commercial and Industrial Services',
			},
			{
				value: 'community-services',
				label: 'Community Services',
			},
			{
				value: 'administrative-services',
				label: 'Administrative Services',
			},
			{
				value: 'residential-and-commercial-services',
				label: 'Residential and Commercial Services',
			},
			{
				value: 'residential-services',
				label: 'Residential Services',
			},
			{
				value: 'residential-and-institutional-services',
				label: 'Residential and Institutional Services',
			},
			{
				value: 'structural-engineering',
				label: 'Structural Engineering',
			},
			{
				value: 'housing-and-community-services',
				label: 'Housing and Community Services',
			},
			{
				value: 'maintenance',
				label: 'Maintenance',
			},
			{
				value: 'construction-and-real-estate',
				label: 'Construction and Real Estate',
			},
			{
				value: 'construction-and-infrastructure',
				label: 'Construction and Infrastructure',
			},
			{
				value: 'construction-and-maintenance',
				label: 'Construction and Maintenance',
			},
			{
				value: 'construction-and-engineering',
				label: 'Construction and Engineering',
			},
			{
				value: 'construction-and-mining',
				label: 'Construction and Mining',
			},
			{
				value: 'construction-and-installation',
				label: 'Construction and Installation',
			},
		],
	},
	{
		value: 'electrical-industry',
		label: 'Electrical',
		subIndustries: [
			{
				value: 'electrical-goods',
				label: 'Electrical Goods',
			},
			{
				value: 'electric-utilities',
				label: 'Electric Utilities',
			},
			{
				value: 'electrical-utilities',
				label: 'Electrical Utilities',
			},
			{
				value: 'electricity-utilities',
				label: 'Electricity, Utilities',
			},
			{
				value: 'electrical-works',
				label: 'Electrical Works',
			},
			{
				value: 'electricity-transmission-and-distribution',
				label: 'Electricity, Transmission and Distribution',
			},
			{
				value: 'electricity-generation-transmission-and-distribution',
				label: 'Electricity Generation, Transmission and Distribution',
			},
			{
				value: 'electricity-utilities',
				label: 'Electricity Utilities',
			},
			{
				value: 'electricity-power-generation',
				label: 'Electricity, Power Generation',
			},
			{
				value: 'electrical-industry',
				label: 'Electrical Industry',
			},
			{
				value: 'electricity-generation-transmission-distribution',
				label: 'Electricity Generation, Transmission & Distribution',
			},
			{
				value: 'electronic-goods',
				label: 'Electronic Goods',
			},
			{
				value: 'electricity-generation',
				label: 'Electricity Generation',
			},
			{
				value: 'electricity-power-generation',
				label: 'Electric Power Generation',
			},
			{
				value: 'electric-power-generation-transmission-and-distribution',
				label: 'Electric Power Generation, Transmission and Distribution',
			},
			{
				value: 'lighting-services',
				label: 'Lighting Services',
			},
			{
				value: 'lighting-equipment-supply',
				label: 'Lighting Equipment Supply',
			},
			{
				value: 'electricity-generation-and-distribution',
				label: 'Electricity Generation and Distribution',
			},
			{
				value: 'electrical-equipment',
				label: 'Electrical Equipment',
			},
			{
				value: 'lighting-industry',
				label: 'Lighting Industry',
			},
			{
				value: 'electronic-components',
				label: 'Electronic Components',
			},
			{
				value: 'electricity-power-generation-and-distribution',
				label: 'Electricity, Power Generation and Distribution',
			},
			{
				value: 'lighting-fixtures',
				label: 'Lighting Fixtures',
			},
			{
				value: 'consumer-electronics',
				label: 'Consumer Electronics',
			},
			{
				value: 'electricity-generation-and-transmission',
				label: 'Electricity Generation and Transmission',
			},
			{
				value: 'electrical-and-power-construction',
				label: 'Electrical and Power Construction',
			},
			{
				value: 'lighting-equipment-supply-and-installation',
				label: 'Lighting Equipment Supply and Installation',
			},
			{
				value: 'electricity-transmission-lines-and-substations',
				label: 'Electricity, Transmission Lines and Substations',
			},
			{
				value: 'electricity-gas-water-other-utilities',
				label: 'Electricity, Gas, Water & Other Utilities',
			},
			{
				value: 'electrical-equipment-and-components',
				label: 'Electrical Equipment and Components',
			},
			{
				value: 'electronic-components-and-equipment',
				label: 'Electronic Components and Equipment',
			},
			{
				value: 'electric-utilities',
				label: 'Electric Utilities',
			},
			{
				value: 'power-generation-and-transmission',
				label: 'Power Generation and Transmission',
			},
			{
				value: 'power-generation-transmission-and-distribution',
				label: 'Power Generation, Transmission and Distribution',
			},
			{
				value: 'power-transmission-line-construction',
				label: 'Power Transmission Line Construction',
			},
			{
				value: 'battery-manufacturing',
				label: 'Battery Manufacturing',
			},
			{
				value: 'battery-manufacturing-and-recycling',
				label: 'Battery Manufacturing and Recycling',
			},
			{
				value: 'battery-recycling',
				label: 'Battery Recycling',
			},
			{
				value: 'power-generation',
				label: 'Power Generation',
			},
			{
				value: 'lighting-fixtures-and-equipment',
				label: 'Lighting Fixtures and Equipment',
			},
			{
				value: 'lighting-equipment',
				label: 'Lighting Equipment',
			},
			{
				value: 'electric-power-generation-transmission-and-distribution',
				label: 'Electric Power Generation, Transmission and Distribution',
			},
			{
				value: 'lighting-systems-and-equipment',
				label: 'Lighting Systems and Equipment',
			},
			{
				value: 'electricity-power-transmission-and-distribution',
				label: 'Electricity, Power Transmission and Distribution',
			},
			{
				value: 'lighting-equipment-and-supplies',
				label: 'Lighting Equipment and Supplies',
			},
			{
				value: 'lighting-systems',
				label: 'Lighting Systems',
			},
			{
				value: 'industrial-electronics',
				label: 'Industrial Electronics',
			},
			{
				value: 'electricity-transmission-lines-and-towers',
				label: 'Electricity, Transmission Lines and Towers',
			},
			{
				value: 'electronic-equipment-manufacturing',
				label: 'Electronic Equipment Manufacturing',
			},
			{
				value: 'electrical-and-electronic-equipment',
				label: 'Electrical and Electronic Equipment',
			},
			{
				value: 'electrical',
				label: 'Electrical',
			},
		],
	},
	{
		value: 'industrial-goods',
		label: 'Industrial Goods',
		subIndustries: [
			{
				value: 'industrial-maintenance',
				label: 'Industrial Maintenance',
			},
			{
				value: 'industrial-services',
				label: 'Industrial Services',
			},
			{
				value: 'industrial-automation',
				label: 'Industrial Automation',
			},
			{
				value: 'industrial-automation-and-control',
				label: 'Industrial Automation and Control',
			},
			{
				value: 'industrial-supplies',
				label: 'Industrial Supplies',
			},
			{
				value: 'industrial-infrastructure',
				label: 'Industrial Infrastructure',
			},
			{
				value: 'industrial-processes',
				label: 'Industrial Processes',
			},
			{
				value: 'services-industry',
				label: 'Services Industry',
			},
			{
				value: 'industrial-equipment',
				label: 'Industrial Equipment',
			},
			{
				value: 'plumbing-supplies',
				label: 'Plumbing Supplies',
			},
			{
				value: 'metal-processing-industry',
				label: 'Metal Processing Industry',
			},
			{
				value: 'industry-manufacturing',
				label: 'Industry: Manufacturing',
			},
			{
				value: 'industrial-safety-goods',
				label: 'Industrial Safety Goods',
			},
			{
				value: 'industry-utilities',
				label: 'Industry: Utilities',
			},
			{
				value: 'industry-public-administration-and-defense',
				label: 'Industry: Public Administration and Defense',
			},
			{
				value: 'green-industry',
				label: 'Green Industry',
			},
			{
				value: 'industrial-machinery-and-equipment',
				label: 'Industrial Machinery and Equipment',
			},
			{
				value: 'plumbing-and-heating-equipment',
				label: 'Plumbing and Heating Equipment',
			},
			{
				value: 'metals-and-metal-products',
				label: 'Metals and Metal Products',
			},
			{
				value: 'biotechnology-industry',
				label: 'Biotechnology Industry',
			},
			{
				value: 'industrial-machinery-and-equipment-2',
				label: 'Industrial Goods: Industrial Machinery and Equipment',
			},
			{
				value: 'industrial-maintenance-2',
				label: 'Industrial Maintenance',
			},
			{
				value: 'plumbing-and-heating-materials',
				label: 'Plumbing and Heating Materials',
			},
			{
				value: 'painting-and-coating-materials',
				label: 'Painting and Coating Materials',
			},
			{
				value: 'material-handling-equipment-and-systems',
				label: 'Material Handling Equipment & Systems',
			},
			{
				value: 'thermal-power-plants',
				label: 'Thermal Power Plants',
			},
			{
				value: 'industrial-safety-equipment',
				label: 'Industrial Safety Equipment',
			},
			{
				value: 'industrial-training',
				label: 'Industrial Training',
			},
			{
				value: 'industrial-safety',
				label: 'Industrial Safety',
			},
			{
				value: 'industrial-safety-equipment-and-supplies',
				label: 'Industrial Safety Equipment and Supplies',
			},
			{
				value: 'industrial-processing',
				label: 'Industrial Processing',
			},
			{
				value: 'industrial-waste-management',
				label: 'Industrial Waste Management',
			},
			{
				value: 'industrial-goods-or-agricultural-goods',
				label: 'Industrial Goods or Agricultural Goods',
			},
			{
				value: 'fire-protection-and-safety-equipment',
				label: 'Fire Protection and Safety Equipment',
			},
			{
				value: 'fire-protection-equipment-and-supplies',
				label: 'Fire Protection Equipment and Supplies',
			},
			{
				value: 'industrial-goods-industrial-machinery-equipment',
				label: 'Industrial Goods: Industrial Machinery & Equipment',
			},
			{
				value: 'building-materials-and-garden-equipment-stores',
				label: 'Building Materials and Garden Equipment Stores',
			},
			{
				value: 'steel-industry',
				label: 'Steel Industry',
			},
			{
				value: 'structural-materials-and-products',
				label: 'Structural Materials and Products',
			},
			{
				value: 'plumbing-fixtures-and-fittings',
				label: 'Plumbing Fixtures and Fittings',
			},
			{
				value: 'surveying-equipment-and-supplies',
				label: 'Surveying Equipment & Supplies',
			},
			{
				value: 'plumbing-services',
				label: 'Plumbing Services',
			},
			{
				value: 'industry-commercial-and-industrial-services',
				label: 'Industry: Commercial and Industrial Services',
			},
			{
				value: 'metal-processing-industries',
				label: 'Metal Processing Industries',
			},
			{
				value: 'industrial-machinery',
				label: 'Industrial Machinery',
			},
			{
				value: 'industrial-goods-or-consumer-goods',
				label: 'Industrial Goods or Consumer Goods',
			},
			{
				value: 'industrial-vehicles',
				label: 'Industrial Vehicles',
			},
			{
				value: 'plumbing-heating-equipment-and-supplies',
				label: 'Plumbing & Heating Equipment and Supplies',
			},
			{
				value: 'industrial-process-and-instrumentation',
				label: 'Industrial Process and Instrumentation',
			},
			{
				value: 'industrial-recycling',
				label: 'Industrial Recycling',
			},
			{
				value: 'material-handling',
				label: 'Material Handling',
			},
			{
				value: 'industrial-heating',
				label: 'Industrial Heating',
			},
			{
				value: 'industrial-measurement-and-control-equipment',
				label: 'Industrial Measurement and Control Equipment',
			},
			{
				value: 'industrial-goods-machinery-equipment',
				label: 'Industrial Goods: Machinery & Equipment',
			},
			{
				value: 'plumbing-and-heating-supplies',
				label: 'Plumbing and Heating Supplies',
			},
			{
				value: 'industrial-coatings',
				label: 'Industrial Coatings',
			},
			{
				value: 'industrial-engineering',
				label: 'Industrial Engineering',
			},
			{
				value: 'industrial-equipment-machinery',
				label: 'Industrial Equipment & Machinery',
			},
			{
				value: 'industrial-gases',
				label: 'Industrial Gases',
			},
			{
				value: 'industrial-equipment-and-supplies',
				label: 'Industrial Equipment & Supplies',
			},
			{
				value: 'industrial-machinery-and-equipment-manufacturing',
				label: 'Industrial Machinery and Equipment Manufacturing',
			},
			{
				value: 'industrial-works',
				label: 'Industrial Works',
			},
			{
				value: 'metal-products-industry',
				label: 'Metal Products Industry',
			},
			{
				value: 'industrial-manufacturing',
				label: 'Industrial Manufacturing',
			},
			{
				value: 'industrial-goods',
				label: 'Industrial Goods',
			},
			{
				value: 'infrastructure-goods',
				label: 'Infrastructure Goods',
			},
			{
				value: 'metal-products',
				label: 'Metal Products',
			},
			{
				value: 'metal-fabrication',
				label: 'Metal Fabrication',
			},
			{
				value: 'metal-fabrication-industry',
				label: 'Metal Fabrication Industry',
			},
			{
				value: 'metal-fabrication-and-machinery',
				label: 'Metal Fabrication and Machinery',
			},
			{
				value: 'industrial-goods-machinery-equipment-2',
				label: 'Industrial Goods: Machinery and Equipment',
			},
			{
				value: 'commercial-and-industrial-equipment',
				label: 'Commercial and Industrial Equipment',
			},
			{
				value: 'material-handling-equipment',
				label: 'Material Handling Equipment',
			},
			{
				value: 'materials-and-components',
				label: 'Materials and Components',
			},
			{
				value: 'industrial-goods-machinery-equipment-3',
				label: 'Industrial Goods: Industrial Machinery & Equipment',
			},
			{
				value: 'material-handling-equipment-supplies',
				label: 'Material Handling Equipment & Supplies',
			},
			{
				value: 'industrial-goods-industrial-machinery-equipment-2',
				label: 'Industrial Goods: Industrial Machinery and Equipment',
			},
			{
				value: 'metals-industry',
				label: 'Metals Industry',
			},
			{
				value: 'metal-fabrication-and-processing',
				label: 'Metal Fabrication and Processing',
			},
			{
				value: 'industrial-equipment-rental-and-leasing',
				label: 'Industrial Equipment Rental and Leasing',
			},
			{
				value: 'industrial-automation-and-robotics',
				label: 'Industrial Automation and Robotics',
			},
			{
				value: 'metal-fabrication-and-machining',
				label: 'Metal Fabrication and Machining',
			},
			{
				value: 'industry-industrial-infrastructure',
				label: 'Industry: Industrial Infrastructure',
			},
			{
				value: 'metal-recycling-industry',
				label: 'Metal Recycling Industry',
			},
			{
				value: 'material-handling-equipment-and-systems',
				label: 'Material Handling Equipment and Systems',
			},
			{
				value: 'material-handling-equipment-and-supplies-2',
				label: 'Material Handling Equipment and Supplies',
			},
			{
				value: 'plumbing-and-heating',
				label: 'Plumbing and Heating',
			},
			{
				value: 'industrial-equipment-manufacturing',
				label: 'Industrial Equipment Manufacturing',
			},
			{
				value: 'industrial-equipment-supply',
				label: 'Industrial Equipment Supply',
			},
			{
				value: 'industrial-goods-or-consumer-goods-2',
				label: 'Industrial Goods (or Consumer Goods, if applicable)',
			},
			{
				value: 'industrial',
				label: 'Industrial',
			},
		],
	},
	{
		value: 'agricultural-goods',
		label: 'Agricultural Goods',
		subIndustries: [
			{
				value: 'agricultural-services',
				label: 'Agricultural Services',
			},
			{
				value: 'agricultural-works',
				label: 'Agricultural Works',
			},
			{
				value: 'fisheries',
				label: 'Fisheries',
			},
			{
				value: 'agricultural-infrastructure',
				label: 'Agricultural Infrastructure',
			},
			{
				value: 'agricultural-goods-crops',
				label: 'Agricultural Goods: Crops',
			},
			{
				value: 'pesticides-and-agrochemicals',
				label: 'Pesticides and Agrochemicals',
			},
			{
				value: 'irrigation-and-agriculture',
				label: 'Irrigation & Agriculture',
			},
			{
				value: 'agro-processing',
				label: 'Agro-processing',
			},
			{
				value: 'agricultural-services-2',
				label: 'Agricultural Services',
			},
			{
				value: 'agricultural-equipment',
				label: 'Agricultural Equipment',
			},
			{
				value: 'agricultural-equipment-and-machinery',
				label: 'Agricultural Equipment and Machinery',
			},
			{
				value: 'agricultural-machinery-and-equipment',
				label: 'Agricultural Machinery and Equipment',
			},
			{
				value: 'agricultural-processing',
				label: 'Agricultural Processing',
			},
			{
				value: 'agricultural-research-and-development',
				label: 'Agricultural Research and Development',
			},
			{
				value: 'pest-control-services',
				label: 'Pest Control Services',
			},
			{
				value: 'agricultural-infrastructure-development',
				label: 'Agricultural Infrastructure Development',
			},
			{
				value: 'public-infrastructure-in-agricultural-communities',
				label: 'Public Infrastructure in Agricultural Communities',
			},
			{
				value: 'horticulture-goods',
				label: 'Horticulture Goods',
			},
			{
				value: 'community-development-social-services-in-agricultural-goods',
				label: 'Community Development & Social Services in Agricultural Goods',
			},
			{
				value: 'public-infrastructure-in-agricultural-sector',
				label: 'Public Infrastructure in Agricultural Sector',
			},
			{
				value: 'agricultural-extension-and-support-services',
				label: 'Agricultural Extension and Support Services',
			},
			{
				value: 'biotechnology',
				label: 'Biotechnology',
			},
			{
				value: 'tea-plantation-and-processing',
				label: 'Tea Plantation and Processing',
			},
			{
				value: 'warehousing-and-storage-of-agricultural-produce',
				label: 'Warehousing and Storage of Agricultural Produce',
			},
			{
				value: 'dairy-industry',
				label: 'Dairy Industry',
			},
			{
				value: 'dairy-farming',
				label: 'Dairy Farming',
			},
			{
				value: 'agriculture',
				label: 'Agriculture',
			},
		],
	},
	{
		value: 'medical-industry',
		label: 'Medical Industry',
		subIndustries: [
			{
				value: 'healthcare-services',
				label: 'Healthcare Services',
			},
			{
				value: 'medical-equipment-supplies',
				label: 'Medical Equipment & Supplies',
			},
			{
				value: 'medical-equipment',
				label: 'Medical Equipment',
			},
			{
				value: 'public-health',
				label: 'Public Health',
			},
			{
				value: 'pharmaceuticals',
				label: 'Pharmaceuticals',
			},
			{
				value: 'pharmaceuticals-and-biotech',
				label: 'Pharmaceuticals and Biotech',
			},
			{
				value: 'pharmaceutical-industry',
				label: 'Pharmaceutical Industry',
			},
			{
				value: 'healthcare-goods',
				label: 'Healthcare Goods',
			},
			{
				value: 'medical-services',
				label: 'Medical Services',
			},
			{
				value: 'healthcare-industry',
				label: 'Healthcare Industry',
			},
			{
				value: 'healthcare',
				label: 'Healthcare',
			},
			{
				value: 'pharmaceuticals-and-biotechnology',
				label: 'Pharmaceuticals and Biotechnology',
			},
			{
				value: 'healthcare-pharmaceuticals',
				label: 'Healthcare & Pharmaceuticals',
			},
			{
				value: 'public-health-services',
				label: 'Public Health Services',
			},
			{
				value: 'emergency-services',
				label: 'Emergency Services',
			},
			{
				value: 'hospitality',
				label: 'Hospitality',
			},
			{
				value: 'emergency-and-safety-services',
				label: 'Emergency and Safety Services',
			},
			{
				value: 'medical-equipment-supply',
				label: 'Medical Equipment Supply',
			},
			{
				value: 'medical-and-health-services',
				label: 'Medical and Health Services',
			},
			{
				value: 'healthcare-and-social-assistance',
				label: 'Healthcare & Social Assistance',
			},
			{
				value: 'eye-care-services',
				label: 'Eye Care Services',
			},
			{
				value: 'health-services',
				label: 'Health Services',
			},
			{
				value: 'hospitality-industry',
				label: 'Hospitality Industry',
			},
			{
				value: 'medical-supplies',
				label: 'Medical Supplies',
			},
			{
				value: 'pharmaceutical-and-biotech-industry',
				label: 'Pharmaceutical and Biotech Industry',
			},
			{
				value: 'optical-and-medical-equipment',
				label: 'Optical and Medical Equipment',
			},
			{
				value: 'nutraceuticals-and-dietary-supplements',
				label: 'Nutraceuticals and Dietary Supplements',
			},
			{
				value: 'pharmaceutical-goods',
				label: 'Pharmaceutical Goods',
			},
			{
				value: 'pharmaceuticals-and-biotech-industries',
				label: 'Pharmaceuticals and Biotech Industries',
			},
			{
				value: 'emergency-services-and-supplies',
				label: 'Emergency Services and Supplies',
			},
			{
				value: 'emergency-and-safety-equipment',
				label: 'Emergency and Safety Equipment',
			},
			{
				value: 'disability-aids-and-equipment',
				label: 'Disability Aids and Equipment',
			},
			{
				value: 'emergency-and-disaster-services',
				label: 'Emergency and Disaster Services',
			},
			{
				value: 'medical-equipment-and-supplies',
				label: 'Medical Equipment and Supplies',
			},
			{
				value: 'health-care-services',
				label: 'Health Care Services',
			},
			{
				value: 'public-health-and-social-services',
				label: 'Public Health and Social Services',
			},
			{
				value: 'health-care',
				label: 'Health Care',
			},
			{
				value: 'public-health-services-2',
				label: 'Public Health Services',
			},
			{
				value: 'medical',
				label: 'Medical',
			},
		],
	},
	{
		value: 'textile-industry',
		label: 'Textile Industry',
		subIndustries: [
			{
				value: 'textiles',
				label: 'Textiles',
			},
			{
				value: 'textiles-and-apparel',
				label: 'Textiles and Apparel',
			},
			{
				value: 'textiles-and-apparels',
				label: 'Textiles and Apparels',
			},
			{
				value: 'textiles-and-textile-products',
				label: 'Textiles and Textile Products',
			},
			{
				value: 'textiles-and-fabrics-production',
				label: 'Textiles & Fabrics Production',
			},
			{
				value: 'textile-services',
				label: 'Textile Services',
			},
			{
				value: 'textile-and-apparel',
				label: 'Textile & Apparel',
			},
			{
				value: 'apparel-and-textiles',
				label: 'Apparel & Textiles',
			},
			{
				value: 'textiles-and-apparel-industry',
				label: 'Textiles and Apparel Industry',
			},
			{
				value: 'textiles-industry',
				label: 'Textiles Industry',
			},
			{
				value: 'textile-and-apparel-services',
				label: 'Textile and Apparel Services',
			},
			{
				value: 'textile-fibers-and-yarns-production',
				label: 'Textile Fibers and Yarns Production',
			},
			{
				value: 'textile-merchants-and-wholesalers',
				label: 'Textile Merchants and Wholesalers',
			},
			{
				value: 'textile-manufacturing',
				label: 'Textile Manufacturing',
			},
			{
				value: 'clothing-and-accessories',
				label: 'Clothing and Accessories',
			},
			{
				value: 'textile-mills',
				label: 'Textile Mills',
			},
			{
				value: 'textiles-and-clothing-industry',
				label: 'Textiles and Clothing Industry',
			},
			{
				value: 'textile',
				label: 'Textile',
			},
		],
	},
	{
		value: 'real-estate',
		label: 'Real Estate',
		subIndustries: [
			{
				value: 'residential-real-estate',
				label: 'Residential Real Estate',
			},
			{
				value: 'housing-and-real-estate',
				label: 'Housing and Real Estate',
			},
			{
				value: 'real-estate-and-rental-leasing',
				label: 'Real Estate and Rental & Leasing',
			},
			{
				value: 'rental-services',
				label: 'Rental Services',
			},
			{
				value: 'land-and-property-management',
				label: 'Land and Property Management',
			},
			{
				value: 'equipment-rental-and-leasing',
				label: 'Equipment Rental and Leasing',
			},
			{
				value: 'commodities-trading',
				label: 'Commodities Trading',
			},
			{
				value: 'building-and-real-estate-services',
				label: 'Building and Real Estate Services',
			},
			{
				value: 'commercial-real-estate',
				label: 'Commercial Real Estate',
			},
			{
				value: 'residential-and-commercial-real-estate',
				label: 'Residential and Commercial Real Estate',
			},
			{
				value: 'real-estate-and-rental',
				label: 'Real Estate and Rental',
			},
			{
				value: 'real-estate-development-and-services',
				label: 'Real Estate Development and Services',
			},
			{
				value: 'real-estate-and-rental-and-leasing',
				label: 'Real Estate and Rental and Leasing',
			},
		],
	},
	{
		value: 'architecture-and-engineering',
		label: 'Architecture and Engineering',
		subIndustries: [
			{
				value: 'architectural-and-engineering-services',
				label: 'Architectural and Engineering Services',
			},
			{
				value: 'architectural-services',
				label: 'Architectural Services',
			},
			{
				value: 'architectural-engineering-and-related-services',
				label: 'Architectural, Engineering, and Related Services',
			},
			{
				value: 'architectural-engineering-and-construction-services',
				label: 'Architectural, Engineering, and Construction Services',
			},
			{
				value: 'architectural-and-construction-materials',
				label: 'Architectural and Construction Materials',
			},
			{
				value: 'architectural-engineering-and-technical-services',
				label: 'Architectural, Engineering and Technical Services',
			},
			{
				value: 'architecture-and-engineering',
				label: 'Architecture and Engineering',
			},
		],
	},
	{
		value: 'arts-and-culture',
		label: 'Arts and Culture',
		subIndustries: [
			{
				value: 'art-and-craft-supplies',
				label: 'Art and Craft Supplies',
			},
			{
				value: 'art-supplies-and-crafts',
				label: 'Art Supplies and Crafts',
			},
			{
				value: 'art-and-cultural-services',
				label: 'Art and Cultural Services',
			},
			{
				value: 'art-and-antiques',
				label: 'Art and Antiques',
			},
			{
				value: 'artistic-and-cultural-goods',
				label: 'Artistic and Cultural Goods',
			},
			{
				value: 'art-and-creative-services',
				label: 'Art and Creative Services',
			},
			{
				value: 'art-and-antique-collectibles',
				label: 'Art and Antique Collectibles',
			},
			{
				value: 'art-and-cultural-industries',
				label: 'Art and Cultural Industries',
			},
			{
				value: 'art-supplies-and-services',
				label: 'Art Supplies and Services',
			},
			{
				value: 'art-supplies',
				label: 'Art Supplies',
			},
			{
				value: 'arts-and-culture',
				label: 'Arts and Culture',
			},
		],
	},
	{
		value: 'maritime-industry',
		label: 'Maritime Industry',
		subIndustries: [
			{
				value: 'maritime-services',
				label: 'Maritime Services',
			},
			{
				value: 'marine-goods',
				label: 'Marine Goods',
			},
			{
				value: 'maritime',
				label: 'Maritime',
			},
		],
	},
	{
		value: 'av-industry',
		label: 'AV Industry',
		subIndustries: [
			{
				value: 'audio-visual-equipment',
				label: 'Audio-Visual Equipment',
			},
			{
				value: 'audio-equipment',
				label: 'Audio Equipment',
			},
			{
				value: 'audio-visual-equipment-rental-and-sales',
				label: 'Audio-Visual Equipment Rental and Sales',
			},
			{
				value: 'audio-visual-equipment-rental-and-leasing',
				label: 'Audio-Visual Equipment Rental and Leasing',
			},
			{
				value: 'audio-and-visual-equipment-rentals',
				label: 'Audio and Visual Equipment Rentals',
			},
			{
				value: 'av',
				label: 'AV',
			},
		],
	},
	{
		value: 'business-services-industry',
		label: 'Business Services Industry',
		subIndustries: [
			{
				value: 'business-services',
				label: 'Business Services',
			},
			{
				value: 'business-and-professional-services',
				label: 'Business and Professional Services',
			},
			{
				value: 'business-process-outsourcing-bpo',
				label: 'Business Process Outsourcing (BPO)',
			},
			{
				value: 'business-and-administrative-services',
				label: 'Business and Administrative Services',
			},
			{
				value: 'business-support-services',
				label: 'Business Support Services',
			},
			{
				value: 'commercial-services',
				label: 'Commercial Services',
			},
			{
				value: 'event-services',
				label: 'Event Services',
			},
		],
	},
	{
		value: 'mechanical-industry',
		label: 'Mechanical Industry',
		subIndustries: [
			{
				value: 'mechanical-engineering',
				label: 'Mechanical Engineering',
			},
			{
				value: 'mechanical-engineering-services',
				label: 'Mechanical Engineering Services',
			},
			{
				value: 'mechanical-equipment-supplies',
				label: 'Mechanical Equipment & Supplies',
			},
			{
				value: 'mechanical-equipment',
				label: 'Mechanical Equipment',
			},
			{
				value: 'mechanical',
				label: 'Mechanical',
			},
		],
	},
	{
		value: 'ceramics-and-glass-industry',
		label: 'Ceramics and Glass Industry',
		subIndustries: [
			{
				value: 'ceramics-industry',
				label: 'Ceramics Industry',
			},
			{
				value: 'ceramics-and-glass',
				label: 'Ceramics and Glass',
			},
			{
				value: 'ceramics-and-glass-industry',
				label: 'Ceramics and Glass Industry',
			},
		],
	},
	{
		value: 'consultancy-services',
		label: 'Consultancy Services',
		subIndustries: [
			{
				value: 'consultancy-services',
				label: 'Consultancy Services',
			},
			{
				value: 'consulting-services',
				label: 'Consulting Services',
			},
			{
				value: 'management-scientific-and-technical-consulting-services',
				label: 'Management, Scientific, and Technical Consulting Services',
			},
			{
				value: 'consulting',
				label: 'Consulting',
			},
		],
	},
	{
		value: 'cultural-and-recreational-industries',
		label: 'Cultural and Recreational Industries',
		subIndustries: [
			{
				value: 'cultural-and-recreational-industries',
				label: 'Cultural and Recreational Industries',
			},
			{
				value: 'cultural-and-educational-services',
				label: 'Cultural and Educational Services',
			},
			{
				value: 'cultural-and-heritage',
				label: 'Cultural and Heritage',
			},
			{
				value: 'cultural-and-religious-institutions',
				label: 'Cultural and Religious Institutions',
			},
			{
				value: 'cultural-and-recreational-services',
				label: 'Cultural and Recreational Services',
			},
			{
				value: 'cultural-and-heritage-institutions',
				label: 'Cultural and Heritage Institutions',
			},
			{
				value: 'cultural-and-recreational',
				label: 'Cultural and Recreational',
			},
		],
	},
	{
		value: 'disaster-management-industry',
		label: 'Disaster Management Industry',
		subIndustries: [
			{
				value: 'disaster-management-and-response',
				label: 'Disaster Management and Response',
			},
			{
				value: 'disaster-management',
				label: 'Disaster Management',
			},
			{
				value: 'disaster-management-and-preparedness',
				label: 'Disaster Management & Preparedness',
			},
			{
				value: 'disaster-response-and-management',
				label: 'Disaster Response and Management',
			},
		],
	},
	{
		value: 'entertainment-industry',
		label: 'Entertainment Industry',
		subIndustries: [
			{
				value: 'entertainment',
				label: 'Entertainment',
			},
			{
				value: 'entertainment-and-recreation',
				label: 'Entertainment and Recreation',
			},
			{
				value: 'entertainment-services',
				label: 'Entertainment Services',
			},
			{
				value: 'entertainment-and-recreation-services',
				label: 'Entertainment and Recreation Services',
			},
			{
				value: 'entertainment-industry',
				label: 'Entertainment Industry',
			},
		],
	},
	{
		value: 'environmental-industry',
		label: 'Environmental Industry',
		subIndustries: [
			{
				value: 'environmental-services',
				label: 'Environmental Services',
			},
			{
				value: 'environmental-industry',
				label: 'Environmental Industry',
			},
			{
				value: 'environmental-monitoring-and-analysis',
				label: 'Environmental Monitoring and Analysis',
			},
			{
				value: 'landscaping-services',
				label: 'Landscaping Services',
			},
			{
				value: 'landscaping-and-horticulture',
				label: 'Landscaping and Horticulture',
			},
			{
				value: 'landscaping-horticulture',
				label: 'Landscaping & Horticulture',
			},
			{
				value: 'landscaping-and-horticulture-services',
				label: 'Landscaping and Horticulture Services',
			},
			{
				value: 'land-development-and-real-estate',
				label: 'Land Development and Real Estate',
			},
			{
				value: 'landscaping-and-gardening-services',
				label: 'Landscaping and Gardening Services',
			},
			{
				value: 'recycling-industry',
				label: 'Recycling Industry',
			},
			{
				value: 'horticulture',
				label: 'Horticulture',
			},
			{
				value: 'gardening-and-landscaping-services',
				label: 'Gardening and Landscaping Services',
			},
			{
				value: 'environmental',
				label: 'Environmental',
			},
		],
	},
	{
		value: 'facilities-management-industry',
		label: 'Facilities Management Industry',
		subIndustries: [
			{
				value: 'facilities-services',
				label: 'Facilities Services',
			},
			{
				value: 'facilities-management',
				label: 'Facilities Management',
			},
			{
				value: 'facility-services',
				label: 'Facility Services',
			},
			{
				value: 'facility-management',
				label: 'Facility Management',
			},
			{
				value: 'facility-management-services',
				label: 'Facility Management Services',
			},
			{
				value: 'facilities-management-services',
				label: 'Facilities Management Services',
			},
		],
	},
	{
		value: 'recreation-and-leisure-industry',
		label: 'Recreation and Leisure Industry',
		subIndustries: [
			{
				value: 'recreational-services',
				label: 'Recreational Services',
			},
			{
				value: 'recreational-goods',
				label: 'Recreational Goods',
			},
			{
				value: 'recreational-facilities',
				label: 'Recreational Facilities',
			},
			{
				value: 'recreational-goods-and-services',
				label: 'Recreational Goods and Services',
			},
			{
				value: 'recreation-services',
				label: 'Recreation Services',
			},
			{
				value: 'recreation',
				label: 'Recreation',
			},
			{
				value: 'recreational-equipment-and-supplies',
				label: 'Recreational Equipment and Supplies',
			},
			{
				value: 'recreational-facilities-and-structures',
				label: 'Recreational Facilities and Structures',
			},
			{
				value: 'recreation-and-entertainment',
				label: 'Recreation and Entertainment',
			},
			{
				value: 'recreational-equipment',
				label: 'Recreational Equipment',
			},
			{
				value: 'recreational-facilities-and-services',
				label: 'Recreational Facilities and Services',
			},
			{
				value: 'recreation-leisure',
				label: 'Recreation & Leisure',
			},
			{
				value: 'recreation-and-leisure',
				label: 'Recreation and Leisure',
			},
			{
				value: 'recreation-industry',
				label: 'Recreation Industry',
			},
			{
				value: 'leisure-and-recreation',
				label: 'Leisure and Recreation',
			},
			{
				value: 'leisure-and-hospitality',
				label: 'Leisure and Hospitality',
			},
			{
				value: 'parks-and-recreational-facilities',
				label: 'Parks and Recreational Facilities',
			},
			{
				value: 'parks-and-recreational-services',
				label: 'Parks and Recreational Services',
			},
			{
				value: 'industry-recreation-and-leisure',
				label: 'Industry: Recreation and Leisure',
			},
			{
				value: 'parks-and-recreation',
				label: 'Parks and Recreation',
			},
			{
				value: 'fitness-and-recreational-sports-centers',
				label: 'Fitness and Recreational Sports Centers',
			},
			{
				value: 'sports-and-recreation',
				label: 'Sports and Recreation',
			},
			{
				value: 'fitness-and-recreational-goods',
				label: 'Fitness and Recreational Goods',
			},
			{
				value: 'fitness-and-recreational-services',
				label: 'Fitness and Recreational Services',
			},
		],
	},
	{
		value: 'forestry-and-logging-industry',
		label: 'Forestry and Logging Industry',
		subIndustries: [
			{
				value: 'forestry-and-logging',
				label: 'Forestry and Logging',
			},
			{
				value: 'forestry-products',
				label: 'Forestry Products',
			},
			{
				value: 'forest-products-and-furniture',
				label: 'Forest Products and Furniture',
			},
			{
				value: 'forestry-products-and-fuel',
				label: 'Forestry Products and Fuel',
			},
			{
				value: 'forestry-products-and-furnishing',
				label: 'Forestry Products & Furnishing',
			},
			{
				value: 'forest-products-harvesting-and-processing',
				label: 'Forest Products Harvesting and Processing',
			},
			{
				value: 'wood-and-bamboo-products-manufacturing',
				label: 'Wood and Bamboo Products Manufacturing',
			},
			{
				value: 'wood-products-industry',
				label: 'Wood Products Industry',
			},
			{
				value: 'wood-and-wood-products',
				label: 'Wood and Wood Products',
			},
			{
				value: 'woodworking',
				label: 'Woodworking',
			},
			{
				value: 'wood-products-manufacturing-and-finishing',
				label: 'Wood Products Manufacturing and Finishing',
			},
		],
	},
	{
		value: 'food-industry',
		label: 'Food Industry',
		subIndustries: [
			{
				value: 'food-services',
				label: 'Food Services',
			},
			{
				value: 'food-processing-industry',
				label: 'Food Processing Industry',
			},
			{
				value: 'food-processing',
				label: 'Food Processing',
			},
			{
				value: 'food-products',
				label: 'Food Products',
			},
			{
				value: 'food-services-industry',
				label: 'Food Services Industry',
			},
			{
				value: 'food-manufacturing',
				label: 'Food Manufacturing',
			},
			{
				value: 'food-production',
				label: 'Food Production',
			},
			{
				value: 'food-service-industry',
				label: 'Food Service Industry',
			},
			{
				value: 'food',
				label: 'Food',
			},
			{
				value: 'meat-processing',
				label: 'Meat Processing',
			},
			{
				value: 'hospitality-and-food-services',
				label: 'Hospitality & Food Services',
			},
			{
				value: 'beverages',
				label: 'Beverages',
			},
			{
				value: 'commercial-food-services',
				label: 'Commercial Food Services',
			},
		],
	},
	{
		value: 'religious-and-spiritual-industry',
		label: 'Religious & Spiritual Industry',
		subIndustries: [
			{
				value: 'religious-institutions',
				label: 'Religious Institutions',
			},
			{
				value: 'religious-services',
				label: 'Religious Services',
			},
			{
				value: 'religious-and-spiritual-services',
				label: 'Religious and Spiritual Services',
			},
			{
				value: 'religious-and-cultural-services',
				label: 'Religious and Cultural Services',
			},
			{
				value: 'religious-and-cultural-institutions',
				label: 'Religious and Cultural Institutions',
			},
			{
				value: 'religious-institutions-and-services',
				label: 'Religious Institutions and Services',
			},
			{
				value: 'religious-and-spiritual',
				label: 'Religious & Spiritual',
			},
		],
	},
	{
		value: 'furniture-industry',
		label: 'Furniture Industry',
		subIndustries: [
			{
				value: 'furniture-manufacturing',
				label: 'Furniture Manufacturing',
			},
			{
				value: 'furniture-and-fixtures',
				label: 'Furniture and Fixtures',
			},
			{
				value: 'furniture-retail',
				label: 'Furniture Retail',
			},
			{
				value: 'furniture-and-bedding',
				label: 'Furniture and Bedding',
			},
			{
				value: 'furniture',
				label: 'Furniture',
			},
			{
				value: 'furniture-manufacturing-and-supply',
				label: 'Furniture Manufacturing and Supply',
			},
			{
				value: 'furniture-and-related-products',
				label: 'Furniture and Related Products',
			},
			{
				value: 'furniture-retail-and-wholesale-trade',
				label: 'Furniture Retail and Wholesale Trade',
			},
			{
				value: 'furnitures',
				label: 'Furnitures',
			},
			{
				value: 'furniture-and-cabinetry',
				label: 'Furniture and Cabinetry',
			},
			{
				value: 'bedding-and-furniture',
				label: 'Bedding and Furniture',
			},
		],
	},
	{
		value: 'sanitation-and-hygiene-industry',
		label: 'Sanitation and Hygiene Industry',
		subIndustries: [
			{
				value: 'sanitary-goods',
				label: 'Sanitary Goods',
			},
			{
				value: 'sanitation-and-waste-management',
				label: 'Sanitation and Waste Management',
			},
			{
				value: 'sanitaryware-and-bathroom-fixtures',
				label: 'Sanitaryware and Bathroom Fixtures',
			},
			{
				value: 'sanitation-and-hygiene-solutions',
				label: 'Sanitation and Hygiene Solutions',
			},
			{
				value: 'sanitation-services',
				label: 'Sanitation Services',
			},
			{
				value: 'sanitation-and-hygiene',
				label: 'Sanitation and Hygiene',
			},
		],
	},
	{
		value: 'manpower-industry',
		label: 'Manpower Industry',
		subIndustries: [
			{
				value: 'labor-services',
				label: 'Labor Services',
			},
			{
				value: 'human-resources',
				label: 'Human Resources',
			},
			{
				value: 'human-settlements',
				label: 'Human Settlements',
			},
			{
				value: 'human-resource-services',
				label: 'Human Resource Services',
			},
			{
				value: 'human-resources-services',
				label: 'Human Resources Services',
			},
			{
				value: 'staffing-services',
				label: 'Staffing Services',
			},
			{
				value: 'manpower',
				label: 'Manpower',
			},
		],
	},
	{
		value: 'government-and-public-administration-industry',
		label: 'Government and Public Administration Industry',
		subIndustries: [
			{
				value: 'government-services',
				label: 'Government Services',
			},
			{
				value: 'government-and-public-administration',
				label: 'Government and Public Administration',
			},
			{
				value: 'government-public-administration',
				label: 'Government & Public Administration',
			},
			{
				value: 'government',
				label: 'Government',
			},
			{
				value: 'government-procurement',
				label: 'Government Procurement',
			},
			{
				value: 'government-grants',
				label: 'Government Grants',
			},
			{
				value: 'government-public-utilities',
				label: 'Government & Public Utilities',
			},
			{
				value: 'government-contracting',
				label: 'Government Contracting',
			},
			{
				value: 'government-administration',
				label: 'Government Administration',
			},
			{
				value: 'government-grants-and-aid',
				label: 'Government Grants and Aid',
			},
			{
				value: 'government-public-sector',
				label: 'Government & Public Sector',
			},
			{
				value: 'local-government',
				label: 'Local Government',
			},
			{
				value: 'local-government-services',
				label: 'Local Government Services',
			},
		],
	},
	{
		value: 'household-goods-and-appliances-industry',
		label: 'Household Goods and Appliances Industry',
		subIndustries: [
			{
				value: 'household-appliances',
				label: 'Household Appliances',
			},
			{
				value: 'home-furnishings-and-appliances',
				label: 'Home Furnishings and Appliances',
			},
			{
				value: 'home-furnishings-and-bedding',
				label: 'Home Furnishings and Bedding',
			},
			{
				value: 'home-appliances',
				label: 'Home Appliances',
			},
			{
				value: 'home-furnishings-and-nondurable-household-goods',
				label: 'Home Furnishings and Nondurable Household Goods',
			},
			{
				value: 'home-furnishings-and-nondurable-goods',
				label: 'Home Furnishings and Nondurable Goods',
			},
			{
				value: 'household-goods-and-supplies',
				label: 'Household Goods and Supplies',
			},
			{
				value: 'household-appliances-and-furnishings',
				label: 'Household Appliances and Furnishings',
			},
			{
				value: 'household-goods-and-home-furnishings',
				label: 'Household Goods & Home Furnishings',
			},
			{
				value: 'home-furnishings',
				label: 'Home Furnishings',
			},
			{
				value: 'household-goods-and-appliances',
				label: 'Household Goods and Appliances',
			},
		],
	},
	{
		value: 'scientific-research-and-development-industry',
		label: 'Scientific Research and Development (R&D) Industry',
		subIndustries: [
			{
				value: 'scientific-research-and-development-services',
				label: 'Scientific Research and Development Services',
			},
			{
				value: 'scientific-research-and-development',
				label: 'Scientific Research and Development',
			},
			{
				value: 'scientific-technical-goods',
				label: 'Scientific & Technical Goods',
			},
			{
				value: 'scientific-research-equipment',
				label: 'Scientific Research Equipment',
			},
			{
				value: 'scientific-research-and-development',
				label: 'Scientific Research & Development',
			},
			{
				value: 'scientific-and-technical-goods',
				label: 'Scientific and Technical Goods',
			},
			{
				value: 'scientific-industries',
				label: 'Scientific Industries',
			},
			{
				value: 'scientific-research-and-development-services',
				label: 'Scientific Research and Development Services',
			},
			{
				value: 'technology-goods',
				label: 'Technology Goods',
			},
			{
				value: 'professional-scientific-and-technical-services',
				label: 'Professional, Scientific, and Technical Services',
			},
			{
				value: 'technology',
				label: 'Industry: Technology',
			},
			{
				value: 'technology-services',
				label: 'Industry: Technology Services',
			},
			{
				value: 'analytical-instruments',
				label: 'Analytical Instruments',
			},
			{
				value: 'inspection-testing-and-certification-services',
				label: 'Inspection, Testing, and Certification Services',
			},
			{
				value: 'testing-inspection-and-certification',
				label: 'Testing, Inspection, and Certification',
			},
			{
				value: 'calibration-and-testing-services',
				label: 'Calibration and Testing Services',
			},
			{
				value: 'industrial-automation-and-control-systems',
				label: 'Industrial Automation and Control Systems',
			},
			{
				value: 'measuring-instruments-and-equipment',
				label: 'Measuring Instruments and Equipment',
			},
			{
				value: 'inspection-services',
				label: 'Inspection Services',
			},
			{
				value: 'industrial-process-control',
				label: 'Industrial Process Control',
			},
			{
				value: 'metrology-and-calibration-services',
				label: 'Metrology and Calibration Services',
			},
			{
				value: 'metrology-services',
				label: 'Metrology Services',
			},
			{
				value: 'measurement-and-metrology-equipment-industry',
				label: 'Measurement and Metrology Equipment Industry',
			},
		],
	},
	{
		value: 'humanitarian-aid-and-relief-industry',
		label: 'Humanitarian Aid and Relief Industry',
		subIndustries: [
			{
				value: 'humanitarian-aid',
				label: 'Humanitarian Aid',
			},
			{
				value: 'humanitarian-aid-and-relief-services',
				label: 'Humanitarian Aid and Relief Services',
			},
			{
				value: 'humanitarian-services',
				label: 'Humanitarian Services',
			},
			{
				value: 'humanitarian-aid-relief-services',
				label: 'Humanitarian Aid & Relief Services',
			},
			{
				value: 'humanitarian-aid-and-relief',
				label: 'Humanitarian Aid and Relief',
			},
		],
	},
	{
		value: 'hvac-industry',
		label: 'HVAC Industry',
		subIndustries: [
			{
				value: 'hvac-heating-ventilation-and-air-conditioning',
				label: 'HVAC (Heating, Ventilation, and Air Conditioning)',
			},
			{
				value: 'hvac-services',
				label: 'HVAC Services',
			},
			{
				value: 'hvac-equipment',
				label: 'HVAC Equipment',
			},
			{
				value: 'hvac-goods',
				label: 'HVAC Goods',
			},
			{
				value: 'hvac-equipment-and-supplies',
				label: 'HVAC Equipment and Supplies',
			},
			{
				value: 'hvacr-industry',
				label: 'HVACR Industry',
			},
			{
				value: 'hvac',
				label: 'HVAC',
			},
		],
	},
	{
		value: 'security-industry',
		label: 'Security Industry',
		subIndustries: [
			{
				value: 'security-services',
				label: 'Security Services',
			},
			{
				value: 'security-and-fire-fighting-services',
				label: 'Security and Fire Fighting Services',
			},
			{
				value: 'security-equipment-and-services',
				label: 'Security Equipment and Services',
			},
			{
				value: 'security-systems',
				label: 'Security Systems',
			},
			{
				value: 'intelligence-and-security-services',
				label: 'Intelligence and Security Services',
			},
			{
				value: 'security',
				label: 'Security',
			},
		],
	},
	{
		value: 'laboratory-industry',
		label: 'Laboratory Industry',
		subIndustries: [
			{
				value: 'laboratories-and-testing-services',
				label: 'Laboratories and Testing Services',
			},
			{
				value: 'laboratories-and-medical-equipment',
				label: 'Laboratories and Medical Equipment',
			},
			{
				value: 'laboratories',
				label: 'Laboratories',
			},
			{
				value: 'laboratory-equipment-and-supplies',
				label: 'Laboratory Equipment and Supplies',
			},
			{
				value: 'laboratory-equipment',
				label: 'Laboratory Equipment',
			},
			{
				value: 'laboratory-equipment-and-supplies',
				label: 'Laboratory Equipment & Supplies',
			},
			{
				value: 'laboratories-and-research-equipment',
				label: 'Laboratories and Research Equipment',
			},
			{
				value: 'laboratories-and-testing-services',
				label: 'Laboratories and Testing Services',
			},
			{
				value: 'laboratories-and-scientific-equipment',
				label: 'Laboratories and Scientific Equipment',
			},
			{
				value: 'laboratory-services',
				label: 'Laboratory Services',
			},
			{
				value: 'laboratories-and-testing-facilities',
				label: 'Laboratories and Testing Facilities',
			},
			{
				value: 'laboratory-testing-and-analysis-services',
				label: 'Laboratory Testing and Analysis Services',
			},
			{
				value: 'laboratory',
				label: 'Laboratory',
			},
		],
	},
	{
		value: 'surveying-industry',
		label: 'Surveying Industry',
		subIndustries: [
			{
				value: 'surveying-services',
				label: 'Surveying Services',
			},
			{
				value: 'survey-services',
				label: 'Survey Services',
			},
			{
				value: 'surveying-and-mapping',
				label: 'Surveying and Mapping',
			},
			{
				value: 'surveying-equipment-and-instruments',
				label: 'Surveying Equipment & Instruments',
			},
			{
				value: 'surveying-equipment-and-supplies',
				label: 'Surveying Equipment and Supplies',
			},
			{
				value: 'surveying-and-mapping-services',
				label: 'Surveying and Mapping Services',
			},
			{
				value: 'surveying-equipment',
				label: 'Surveying Equipment',
			},
			{
				value: 'surveying',
				label: 'Surveying',
			},
		],
	},
	{
		value: 'trade-industry',
		label: 'Trade Industry',
		subIndustries: [
			{
				value: 'trading-companies',
				label: 'Trading Companies',
			},
			{
				value: 'trade-and-services',
				label: 'Trade and Services',
			},
			{
				value: 'trade-shows-and-exhibitions',
				label: 'Trade Shows and Exhibitions',
			},
			{
				value: 'trade-shows-and-fairs',
				label: 'Trade Shows and Fairs',
			},
			{
				value: 'trading',
				label: 'Trading',
			},
			{
				value: 'trading-companies-and-agents',
				label: 'Trading Companies and Agents',
			},
			{
				value: 'retail-trade',
				label: 'Retail Trade',
			},
			{
				value: 'commercial-trade',
				label: 'Commercial Trade',
			},
			{
				value: 'commodity-trading',
				label: 'Commodity Trading',
			},
		],
	},
	{
		value: 'financial-industry',
		label: 'Financial Industry',
		subIndustries: [
			{
				value: 'insurance',
				label: 'Insurance',
			},
			{
				value: 'insurance-services',
				label: 'Insurance Services',
			},
			{
				value: 'insurance-and-risk-management-services',
				label: 'Insurance and Risk Management Services',
			},
			{
				value: 'commercial-banking',
				label: 'Commercial Banking',
			},
			{
				value: 'banking',
				label: 'Banking',
			},
			{
				value: 'financial-services',
				label: 'Financial Services',
			},
			{
				value: 'microfinance-and-community-development',
				label: 'Microfinance and Community Development',
			},
			{
				value: 'public-finance',
				label: 'Public Finance',
			},
			{
				value: 'property-and-casualty-insurance',
				label: 'Property and Casualty Insurance',
			},
			{
				value: 'public-finance-and-budgeting',
				label: 'Public Finance and Budgeting',
			},
			{
				value: 'financial-services-industry',
				label: 'Financial Services Industry',
			},
			{
				value: 'insurance-industry',
				label: 'Insurance Industry',
			},
			{
				value: 'finance',
				label: 'Finance',
			},
		],
	},
	{
		value: 'waste-management-industry',
		label: 'Waste Management Industry',
		subIndustries: [
			{
				value: 'waste-management',
				label: 'Waste Management',
			},
			{
				value: 'waste-management-and-recycling',
				label: 'Waste Management and Recycling',
			},
			{
				value: 'waste-management-services',
				label: 'Waste Management Services',
			},
			{
				value: 'wastewater-treatment',
				label: 'Wastewater Treatment',
			},
			{
				value: 'waste-management-and-remediation-services',
				label: 'Waste Management and Remediation Services',
			},
			{
				value: 'wastewater-treatment-plants-and-systems',
				label: 'Wastewater Treatment Plants and Systems',
			},
			{
				value: 'waste-management',
				label: 'Waste Management',
			},
		],
	},
	{
		value: 'safety-industry',
		label: 'Safety Industry',
		subIndustries: [
			{
				value: 'fire-protection-services',
				label: 'Fire Protection Services',
			},
			{
				value: 'fire-protection-equipment-and-services',
				label: 'Fire Protection Equipment and Services',
			},
			{
				value: 'fire-protection',
				label: 'Fire Protection',
			},
			{
				value: 'safety-equipment-and-supplies',
				label: 'Safety Equipment and Supplies',
			},
			{
				value: 'public-safety',
				label: 'Public Safety',
			},
			{
				value: 'safety-goods',
				label: 'Safety Goods',
			},
			{
				value: 'personal-protective-equipment',
				label: 'Personal Protective Equipment',
			},
			{
				value: 'fire-protection-equipment',
				label: 'Fire Protection Equipment',
			},
			{
				value: 'fire-protection-equipment-and-services',
				label: 'Fire Protection Equipment & Services',
			},
			{
				value: 'emergency-and-remedial-services',
				label: 'Emergency and Remedial Services',
			},
			{
				value: 'personal-protective-equipment-ppe',
				label: 'Personal Protective Equipment (PPE)',
			},
			{
				value: 'safety',
				label: 'Safety',
			},
		],
	},
	{
		value: 'sugar-industry',
		label: 'Sugar Industry',
		subIndustries: [
			{
				value: 'sugar-processing-industry',
				label: 'Sugar Processing Industry',
			},
			{
				value: 'sugar-industry',
				label: 'Sugar Industry',
			},
			{
				value: 'sugar-processing',
				label: 'Sugar Processing',
			},
		],
	},
	{
		value: 'professional-services',
		label: 'Professional Services',
		subIndustries: [
			{
				value: 'legal-services',
				label: 'Legal Services',
			},
			{
				value: 'information-services',
				label: 'Information Services',
			},
			{
				value: 'event-planning-and-management',
				label: 'Event Planning and Management',
			},
			{
				value: 'professional-technical-and-management-services',
				label: 'Professional, Technical, and Management Services',
			},
			{
				value: 'professional-technical-services',
				label: 'Professional, Technical Services',
			},
			{
				value: 'marketplaces-and-fairs',
				label: 'Marketplaces and Fairs',
			},
			{
				value: 'event-management',
				label: 'Event Management',
			},
		],
	},
	{
		value: 'animal-husbandry',
		label: 'Animal Husbandry',
		subIndustries: [
			{
				value: 'animal-services',
				label: 'Animal Services',
			},
			{
				value: 'livestock-and-animal-husbandry',
				label: 'Livestock and Animal Husbandry',
			},
			{
				value: 'livestock-production',
				label: 'Livestock Production',
			},
			{
				value: 'domestic-services',
				label: 'Domestic Services',
			},
			{
				value: 'livestock-and-poultry-production',
				label: 'Livestock and Poultry Production',
			},
		],
	},
	{
		value: 'plastic-industry',
		label: 'Plastic Industry',
		subIndustries: [
			{
				value: 'plastic-products-industry',
				label: 'Plastic Products Industry',
			},
			{
				value: 'plastics-and-rubber-products',
				label: 'Plastics and Rubber Products',
			},
			{
				value: 'plastics-and-rubber-industry',
				label: 'Plastics and Rubber Industry',
			},
			{
				value: 'plastics-industry',
				label: 'Plastics Industry',
			},
			{
				value: 'plastic',
				label: 'Plastic',
			},
		],
	},
	{
		value: 'printing-industry',
		label: 'Printing Industry',
		subIndustries: [
			{
				value: 'printing-and-related-support-activities',
				label: 'Printing and Related Support Activities',
			},
			{
				value: 'printing-and-publishing',
				label: 'Printing and Publishing',
			},
			{
				value: 'printing-services',
				label: 'Printing Services',
			},
			{
				value: 'printing',
				label: 'Printing',
			},
		],
	},
	{
		value: 'marketing',
		label: 'Marketing',
		subIndustries: [
			{
				value: 'marketing-services',
				label: 'Marketing Services',
			},
			{
				value: 'publishing-industry',
				label: 'Publishing Industry',
			},
			{
				value: 'publishing',
				label: 'Publishing',
			},
			{
				value: 'signage-and-advertising',
				label: 'Signage and Advertising',
			},
			{
				value: 'advertising-and-marketing-services',
				label: 'Advertising and Marketing Services',
			},
			{
				value: 'media-and-marketing-services',
				label: 'Media and Marketing Services',
			},
			{
				value: 'marketing-and-advertising-services',
				label: 'Marketing and Advertising Services',
			},
			{
				value: 'advertising-services',
				label: 'Advertising Services',
			},
			{
				value: 'media-and-marketing',
				label: 'Media and Marketing',
			},
			{
				value: 'media-and-communications',
				label: 'Media and Communications',
			},
			{
				value: 'media-and-entertainment',
				label: 'Media and Entertainment',
			},
			{
				value: 'marketing-and-advertising',
				label: 'Marketing and Advertising',
			},
			{
				value: 'advertising-and-marketing',
				label: 'Advertising & Marketing',
			},
		],
	},
	{
		value: 'stationery-office-supply',
		label: 'Stationery & Office Supply',
		subIndustries: [
			{
				value: 'office-equipment-and-supplies',
				label: 'Office Equipment and Supplies',
			},
			{
				value: 'office-supplies',
				label: 'Office Supplies',
			},
			{
				value: 'office-supplies-and-equipment',
				label: 'Office Supplies and Equipment',
			},
			{
				value: 'office-stationery-supplies',
				label: 'Office & Stationery Supplies',
			},
			{
				value: 'office-equipment-rental',
				label: 'Office Equipment Rental',
			},
			{
				value: 'office-administrative-supplies',
				label: 'Office and Administrative Supplies',
			},
			{
				value: 'office-furniture-and-equipment',
				label: 'Office Furniture and Equipment',
			},
			{
				value: 'office-equipment-rental-leasing-services',
				label: 'Office Equipment Rental, Leasing, and Services',
			},
			{
				value: 'office-furniture-supply-delivery',
				label: 'Office Furniture Supply and Delivery',
			},
			{
				value: 'office-equipment-renting-leasing-sales',
				label: 'Office Equipment Renting, Leasing, or Sales',
			},
			{
				value: 'office-services',
				label: 'Office Services',
			},
			{
				value: 'office-and-school-supplies',
				label: 'Office and School Supplies',
			},
			{
				value: 'office-equipment-furniture',
				label: 'Office Equipment and Furniture',
			},
			{
				value: 'stationery-and-office-supplies',
				label: 'Stationery and Office Supplies',
			},
		],
	},
	{
		value: 'instrumentation-control-equipment',
		label: 'Instrumentation and Control Equipment',
		subIndustries: [],
	},
	{
		value: 'automotive',
		label: 'Automotive',
		subIndustries: [
			{
				value: 'automotive-industry',
				label: 'Automotive Industry',
			},
			{
				value: 'automotive-goods',
				label: 'Automotive Goods',
			},
			{
				value: 'automotive-services',
				label: 'Automotive Services',
			},
			{
				value: 'motor-vehicle-trade-repair',
				label: 'Motor Vehicle Trade and Repair',
			},
		],
	},
	{
		value: 'energy',
		label: 'Energy',
		subIndustries: [
			{
				value: 'renewable-energy',
				label: 'Renewable Energy',
			},
			{
				value: 'oil-gas-extraction',
				label: 'Oil and Gas Extraction',
			},
			{
				value: 'energy-industry',
				label: 'Energy Industry',
			},
			{
				value: 'energy-services',
				label: 'Energy Services',
			},
			{
				value: 'energy-efficiency-solutions',
				label: 'Energy Efficiency Solutions',
			},
			{
				value: 'thermal-energy',
				label: 'Thermal Energy',
			},
			{
				value: 'oil-gas-chemicals',
				label: 'Oil, Gas & Chemicals',
			},
			{
				value: 'energy-utilities',
				label: 'Energy & Utilities',
			},
			{
				value: 'energy-environmental-services',
				label: 'Energy and Environmental Services',
			},
			{
				value: 'energy-storage',
				label: 'Energy Storage',
			},
			{
				value: 'biomass-energy',
				label: 'Biomass Energy',
			},
			{
				value: 'oil-gas-production-transmission',
				label: 'Oil & Gas Production and Transmission',
			},
			{
				value: 'energy-efficiency',
				label: 'Energy Efficiency',
			},
			{
				value: 'petroleum-refining',
				label: 'Petroleum Refining',
			},
			{
				value: 'renewable-energy-industry',
				label: 'Renewable Energy Industry',
			},
			{
				value: 'energy-efficiency-conservation',
				label: 'Energy Efficiency & Conservation',
			},
			{
				value: 'petroleum-industry',
				label: 'Petroleum Industry',
			},
		],
	},

	{
		value: 'healthcare',
		label: 'Healthcare',
		subIndustries: [
			{
				value: 'hospital-facilities-management',
				label: 'Hospital Facilities Management',
			},
			{
				value: 'medical-equipment-services',
				label: 'Medical Equipment Services',
			},
		],
	},
];

export function useTenderFilters() {
	// States
	const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
	const [selectedTenderValues, setSelectedTenderValues] = useState<string[]>(
		[],
	);
	const [industry, setIndustry] = useState<string[]>([]);
	const [classification, setClassification] = useState<string[]>([]);
	const [dateRange, setDateRange] = useState<any>(null);
	const [searchList, setSearchList] = useState<string[]>([]);
	// const [filterIndustry, setFilterIndustry] = useState<any>([]);
	const [filterClassification, setFilterClassification] = useState<any>([]);
	// const [filterSubIndustry, setFilterSubIndustry] = useState<any>([]);
	const [suggestionIndustry, setSuggestionIndustry] = useState<string[]>([]);
	const [suggestionClassification, setSuggestionClassification] = useState<
		string[]
	>([]);

	const [filterIndustry, setFilterIndustry] = useState(
		industriesData.map((ind) => ({ value: ind.value, label: ind.label })),
	);
	const [filterSubIndustry, setFilterSubIndustry] = useState(
		industriesData.flatMap((ind) => ind.subIndustries),
	);

	// States state variables (similar to industry)
	const [states, setStates] = useState<string[]>([]); // Selected states
	const [filterStates, setFilterStates] = useState<any>([]); // All available states from API

	const data = useQuery({
		queryKey: ['states'],
		queryFn: async () => {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/states',
			);
			setFilterStates(response.data.states); // Store all states in filterStates
			return response.data.states;
		},
	});

	// Fetch suggestions
	const { data: suggestions } = useQuery({
		queryKey: ['suggestions'],
		queryFn: async () => {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/auth/suggestion/check',
				{
					headers: {
						Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
					},
				},
			);
			const { suggestion } = response.data;
			setSuggestionIndustry(suggestion?.industry || []);
			setSuggestionClassification(suggestion?.classification || []);
			return suggestion;
		},
		staleTime: Infinity,
	});

	// Fetch industries
	const { data: industries, isLoading: isLoadingIndustries } = useQuery({
		queryKey: ['industries'],
		queryFn: async () => {
			const response = await axios.get(
				process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/industries',
			);
			setFilterIndustry(response.data.industries);
			return response.data.industries;
		},
	});

	const { data: classifications, isLoading: isLoadingClassifications } =
		useQuery({
			queryKey: ['classifications'],
			queryFn: async () => {
				const response = await axios.get(
					process.env.NEXT_PUBLIC_API_ENDPOINT + '/api/tender/classifications',
				);
				setFilterClassification(response.data.classifications);
				return response.data.classifications;
			},
		});

	// Fetch sub-industries
	// const { data: subIndustries, isLoading: isLoadingSubIndustries } = useQuery({
	//   queryKey: ["subIndustries"],
	//   queryFn: async () => {
	//     const response = await axios.get(
	//       process.env.NEXT_PUBLIC_API_ENDPOINT + "/api/tender/sub-industries"
	//     );
	//     setFilterSubIndustry(response.data.subIndustries);
	//     return response.data.subIndustries;
	//   },
	// });

	const buildQueryParams = useCallback(() => {
		const queryParams = new URLSearchParams();

		const appendMultiSelect = (key: string, values: any[]) => {
			if (values.length) {
				const isObjectWithValue =
					values[0] && typeof values[0] === 'object' && 'value' in values[0];
				const valueString = isObjectWithValue
					? values.map((item) => item.value).join(',')
					: values.join(',');
				queryParams.append(key, valueString);
			}
		};

		appendMultiSelect('district', selectedDistricts);
		appendMultiSelect('tenderValue', selectedTenderValues);
		appendMultiSelect('industry', industry);
		appendMultiSelect('classification', classification ? [classification] : []);
		appendMultiSelect('states', states);

		if (searchList.length) {
			queryParams.append('search', searchList.join(','));
		}

		if (dateRange?.from && dateRange?.to) {
			queryParams.append('startDate', dateRange.from.toISOString());
			queryParams.append('endDate', dateRange.to.toISOString());
		}

		return queryParams;
	}, [
		selectedDistricts,
		selectedTenderValues,
		industry,
		classification,
		searchList,
		dateRange,
		states,
	]);

	return {
		districts,
		departments,
		selectedDistricts,
		setSelectedDistricts,
		selectedTenderValues,
		setSelectedTenderValues,
		industry,
		setIndustry,
		classification,
		setClassification,
		dateRange,
		setDateRange,
		searchList,
		setSearchList,
		filterIndustry,
		filterSubIndustry,
		buildQueryParams,
		suggestionIndustry,
		suggestionClassification,
		setSuggestionIndustry,
		setSuggestionClassification,
		setFilterClassification,
		filterClassification,
		isLoadingClassifications,
		states,
		setStates,
		filterStates,
		setFilterStates,
	};
}
