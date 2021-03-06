import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import ClayButton from '../shared/ClayButton.es';
import ClayIcon from '../shared/ClayIcon.es';
import ClaySelect from '../shared/ClaySelect.es';
import DecimalInput from '../inputs/DecimalInput.es';
import DateInput from '../inputs/DateInput.es';
import BooleanInput from '../inputs/BooleanInput.es';
import SelectEntityInput from '../inputs/SelectEntityInput.es';
import IntegerInput from '../inputs/IntegerInput.es';
import StringInput from '../inputs/StringInput.es';
import {DragSource as dragSource, DropTarget as dropTarget} from 'react-dnd';
import {DragTypes} from '../../utils/drag-types.es';
import {PROPERTY_TYPES} from '../../utils/constants.es';
import getCN from 'classnames';
import {
	createNewGroup,
	dateToInternationalHuman,
	getSupportedOperatorsFromType,
	sub
} from '../../utils/utils.es';

const acceptedDragTypes = [
	DragTypes.CRITERIA_ROW,
	DragTypes.PROPERTY
];

/**
 * Prevents rows from dropping onto itself.
 * This method must be called `canDrop`.
 * @param {Object} props Component's current props.
 * @param {DropTargetMonitor} monitor
 * @returns {boolean} True if the target should accept the item.
 */
function canDrop(props, monitor) {
	const {groupId: destGroupId, index: destIndex} = props;
	const {groupId: startGroupId, index: startIndex} = monitor.getItem();

	return destGroupId !== startGroupId || destIndex !== startIndex;
}

/**
 * Implements the behavior of what will occur when an item is dropped.
 * Items dropped on top of rows will create a new grouping.
 * This method must be called `drop`.
 * @param {Object} props Component's current props.
 * @param {DropTargetMonitor} monitor
 */
function drop(props, monitor) {
	const {
		criterion,
		groupId: destGroupId,
		index: destIndex,
		onChange,
		onMove,
		supportedOperators,
		supportedPropertyTypes
	} = props;

	const {
		criterion: droppedCriterion,
		groupId: startGroupId,
		index: startIndex
	} = monitor.getItem();

	const {
		defaultValue,
		operatorName,
		propertyName,
		type,
		value
	} = droppedCriterion;

	const droppedCriterionValue = value || defaultValue;

	const operators = getSupportedOperatorsFromType(
		supportedOperators,
		supportedPropertyTypes,
		type
	);

	const newCriterion = {
		operatorName: operatorName ?
			operatorName :
			operators[0].name,
		propertyName,
		value: droppedCriterionValue
	};

	const itemType = monitor.getItemType();

	const newGroup = createNewGroup([criterion, newCriterion]);

	if (itemType === DragTypes.PROPERTY) {
		onChange(newGroup);
	}
	else if (itemType === DragTypes.CRITERIA_ROW) {
		onMove(
			startGroupId,
			startIndex,
			destGroupId,
			destIndex,
			newGroup,
			true
		);
	}
}

/**
 * Passes the required values to the drop target.
 * This method must be called `beginDrag`.
 * @param {Object} props Component's current props
 * @returns {Object} The props to be passed to the drop target.
 */
function beginDrag({criterion, groupId, index}) {
	return {criterion, groupId, index};
}

class CriteriaRow extends Component {
	static propTypes = {
		canDrop: PropTypes.bool,
		connectDragPreview: PropTypes.func,
		connectDragSource: PropTypes.func,
		connectDropTarget: PropTypes.func,
		criterion: PropTypes.object,
		dragging: PropTypes.bool,
		editing: PropTypes.bool,
		groupId: PropTypes.string.isRequired,
		hover: PropTypes.bool,
		index: PropTypes.number.isRequired,
		modelLabel: PropTypes.string,
		onAdd: PropTypes.func.isRequired,
		onChange: PropTypes.func.isRequired,
		onDelete: PropTypes.func.isRequired,
		onMove: PropTypes.func.isRequired,
		supportedOperators: PropTypes.array,
		supportedProperties: PropTypes.array,
		supportedPropertyTypes: PropTypes.object
	};

	static defaultProps = {
		criterion: {},
		editing: true,
		supportedOperators: [],
		supportedProperties: [],
		supportedPropertyTypes: {}
	};

	_getReadableCriteriaString = (
		modelLabel,
		propertyLabel,
		operatorLabel,
		value,
		type
	) => {
		const parsedValue = (type === PROPERTY_TYPES.DATE) ?
			dateToInternationalHuman(value) :
			value;

		return sub(
			Liferay.Language.get('x-with-property-x-x-x'),
			[
				<span key="model-name">
					{modelLabel}
				</span>,
				<b key="property">
					{propertyLabel}
				</b>,
				<span className="operator" key="operator">
					{operatorLabel}
				</span>,
				<b key="value">
					{parsedValue}
				</b>
			],
			false
		);
	}

	/**
	 * Gets the selected item object with a `name` and `label` property for a
	 * selection input. If one isn't found, a new object is returned using the
	 * idSelected for name and label.
	 * @param {Array} list The list of objects to search through.
	 * @param {string} idSelected The name to match in each object in the list.
	 * @return {object} An object with a `name`, `label` and `type` property.
	 */
	_getSelectedItem = (list, idSelected) => {
		const selectedItem = list.find(item => item.name === idSelected);

		return selectedItem ?
			selectedItem :
			{
				label: idSelected,
				name: idSelected,
				type: PROPERTY_TYPES.STRING
			};
	}

	_handleDelete = event => {
		event.preventDefault();

		const {index, onDelete} = this.props;

		onDelete(index);
	}

	_handleDuplicate = event => {
		event.preventDefault();

		const {criterion, index, onAdd} = this.props;

		onAdd(index + 1, criterion);
	}

	_handleInputChange = propertyName => event => {
		const {criterion, onChange} = this.props;

		onChange(
			{
				...criterion,
				[propertyName]: event.target.value
			}
		);
	};

	_handleTypedInputChange = (value, type) => {
		const {criterion, onChange} = this.props;

		if (Array.isArray(value)) {
			const items = value.map(
				item => ({
					...criterion,
					value: item
				})
			);

			onChange(createNewGroup(items));
		}
		else {
			onChange(
				{
					...criterion,
					type,
					value
				}
			);
		}
	}

	_renderValueInput = (selectedProperty, value) => {
		const inputComponentsMap = {
			[PROPERTY_TYPES.BOOLEAN]: BooleanInput,
			[PROPERTY_TYPES.DATE]: DateInput,
			[PROPERTY_TYPES.DOUBLE]: DecimalInput,
			[PROPERTY_TYPES.ID]: SelectEntityInput,
			[PROPERTY_TYPES.INTEGER]: IntegerInput,
			[PROPERTY_TYPES.STRING]: StringInput
		};

		const InputComponent = inputComponentsMap[selectedProperty.type] ||
			inputComponentsMap[PROPERTY_TYPES.STRING];

		return (
			<InputComponent
				onChange={this._handleTypedInputChange}
				options={selectedProperty.options}
				selectEntity={selectedProperty.selectEntity}
				value={value}
			/>
		);
	}

	render() {
		const {
			canDrop,
			connectDragPreview,
			connectDragSource,
			connectDropTarget,
			criterion,
			dragging,
			editing,
			hover,
			modelLabel,
			supportedOperators,
			supportedProperties,
			supportedPropertyTypes
		} = this.props;

		const selectedOperator = this._getSelectedItem(
			supportedOperators,
			criterion.operatorName
		);

		const selectedProperty = this._getSelectedItem(
			supportedProperties,
			criterion.propertyName
		);

		const operatorLabel = selectedOperator ? selectedOperator.label : '';
		const propertyLabel = selectedProperty ? selectedProperty.label : '';
		const value = criterion ? criterion.value : '';

		const propertyType = selectedProperty ? selectedProperty.type : '';

		const filteredSupportedOperators = getSupportedOperatorsFromType(
			supportedOperators,
			supportedPropertyTypes,
			propertyType
		);

		const classes = getCN(
			'criterion-row-root',
			{
				'dnd-drag': dragging,
				'dnd-hover': hover && canDrop
			}
		);

		return connectDropTarget(
			connectDragPreview(
				<div
					className={classes}
				>
					{editing ? (
						<div className="edit-container">
							{connectDragSource(
								<div className="drag-icon">
									<ClayIcon iconName="drag" />
								</div>
							)}

							<span className="criterion-string">
								{sub(
									Liferay.Language.get('x-with-property-x'),
									[
										<span key="model-name">
											{modelLabel}
										</span>,
										<b key="property">
											{propertyLabel}
										</b>
									],
									false
								)}
							</span>

							<ClaySelect
								className="criterion-input operator-input form-control"
								onChange={this._handleInputChange(
									'operatorName'
								)}
								options={filteredSupportedOperators.map(
									({label, name}) => ({
										label,
										value: name
									})
								)}
								selected={selectedOperator && selectedOperator.name}
							/>

							{this._renderValueInput(selectedProperty, value)}

							<ClayButton
								borderless
								className="duplicate-button"
								iconName="paste"
								monospaced
								onClick={this._handleDuplicate}
							/>

							<ClayButton
								borderless
								iconName="trash"
								monospaced
								onClick={this._handleDelete}
							/>
						</div>
					) : (
						<div className="read-only-container">
							<span className="criterion-string">
								{this._getReadableCriteriaString(
									modelLabel,
									propertyLabel,
									operatorLabel,
									value,
									selectedProperty.type
								)}
							</span>
						</div>
					)}
				</div>
			)
		);
	}
}

const CriteriaRowWithDrag = dragSource(
	DragTypes.CRITERIA_ROW,
	{
		beginDrag
	},
	(connect, monitor) => ({
		connectDragPreview: connect.dragPreview(),
		connectDragSource: connect.dragSource(),
		dragging: monitor.isDragging()
	})
)(CriteriaRow);

export default dropTarget(
	acceptedDragTypes,
	{
		canDrop,
		drop
	},
	(connect, monitor) => ({
		canDrop: monitor.canDrop(),
		connectDropTarget: connect.dropTarget(),
		hover: monitor.isOver()
	})
)(CriteriaRowWithDrag);