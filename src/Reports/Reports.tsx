import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { Days } from '../App/App';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Reports.scss';

import {Line} from 'react-chartjs-2';
import {sevenDayGraph, thirtyDayGraph} from './Charts'
export interface ReportsProps {
	days: Days[]
}

const Reports: React.SFC<ReportsProps> = ({ days }) => {
	const [charts, setCharts] = useState([sevenDayGraph(days),thirtyDayGraph(days)])

	return (
		<main className='Main-User-View' style={{ justifyContent: 'flex-start' }}>
			<p className='headings'>Reports</p>
			<Carousel showThumbs={false}>
				{charts.map((chart, i) => {
					return (
						<div className='display-chart' key={i}>
							<Line data={chart} options={{
								responsive: true,
								maintainAspectRatio : false,
								title: {text: 'Past 7 Days', 
									display: true, 
									fontFamily: 'Capriola', 
									fontColor: 'rgba(17,138,178, 1)',
									fontSize: 18,},
								legend: {
									display: false,
									// position: 'bottom',
									// labels: {
									// 	fontFamily: 'Capriola',
									// 	fontSize: 12,
									// }
								},
								scales: {
									xAxes: [{
										ticks: {
											fontSize: 12,
										}
									}]
								}
							}}
							/>
						</div>
					)
				})}
			</Carousel>
		</main>
	)
}

export default Reports;